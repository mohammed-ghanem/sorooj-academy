/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { axiosBaseQuery } from "@/store/base/axiosBaseQuery";
import {
    extractSubjectExamAttempt,
    resolveSubjectExamUiState,
} from "@/lib/studyLesson/lessonExamState";
import {
    buildExamSubmitFormData,
    mapPayloadToVideoExam,
    unwrapExamResponse,
    unwrapSubmitExamResult,
} from "@/store/lessons/lessonsApi";
import type {
    StudyLesson,
    StudySubjectDetail,
    StudySubjectDoctor,
} from "@/types/studySubjectDetail";
import type {
    VideoExam,
    VideoExamAnswerPayload,
    VideoExamSubmitResult,
} from "@/types/studyVideoExam";

const BASE_PATH = "subjects";

function resolveAcceptLanguage(lang?: string): string {
    const fromArg =
        typeof lang === "string" && lang.trim() !== "" ? lang.trim() : "";
    return fromArg || Cookies.get("lang") || "ar";
}

function toNumericId(value: unknown): number | undefined {
    if (typeof value === "number" && !Number.isNaN(value)) return value;
    if (typeof value === "string" && value.trim() !== "") {
        const n = Number(value);
        if (!Number.isNaN(n)) return n;
    }
    return undefined;
}

type DoctorApiPayload = {
    id?: number | string;
    name?: string;
};

type LessonApiPayload = {
    id?: number | string;
    lesson_number?: string;
    title?: string;
    content?: string;
    brief_content?: string;
    order_index?: number;
    is_active?: number | boolean;
    videos_count?: number;
    attachments_count?: number;
    is_watch_completed?: boolean;
    all_videos_completed?: boolean;
    student_has_passed_lesson_exam?: boolean;
    is_completed?: boolean;
    is_locked?: boolean | number;
    can_access_lesson?: boolean | number;
    videos_progress?: {
        completed?: number;
        total?: number;
        percentage?: number;
    };
    doctor?: DoctorApiPayload;
};

export type SubjectDetailApiPayload = {
    id?: number | string;
    name?: string;
    name_ar?: string;
    name_en?: string;
    cover?: string;
    about_subject?: string;
    about?: string;
    description?: string;
    lessons_count?: number;
    lesson_exams_count?: number;
    order_index?: number;
    is_active?: number | boolean;
    is_subject_watch_completed?: boolean;
    lessons_progress?: {
        completed?: number;
        total?: number;
        percentage?: number;
    };
    is_locked?: boolean | number;
    can_access_subject?: boolean | number;
    has_active_subject_exam?: boolean;
    can_access_subject_exam?: boolean;
    can_retake_subject_exam?: boolean | number;
    student_has_passed_subject_exam?: boolean;
    subject_exam_status?: string;
    student_subject_exam_status?: string;
    subject_exam_is_passed?: boolean | null;
    student_subject_exam_is_passed?: boolean | null;
    is_subject_exam_under_review?: boolean | number;
    study_term?: {
        id?: number | string;
        name?: string;
    };
    doctors?: DoctorApiPayload[];
    lessons?: LessonApiPayload[];
};

function pickTitle(
    item: { name?: string; name_ar?: string; name_en?: string },
    lang: string,
): string {
    const n = lang === "en" ? item.name_en : lang === "ar" ? item.name_ar : "";
    return (
        typeof n === "string" && n.trim() !== ""
            ? n
            : (item.name ?? item.name_ar ?? item.name_en ?? "")
    ).trim();
}

function unwrapSubjectPayload(
    response: unknown,
): SubjectDetailApiPayload | null {
    if (!response || typeof response !== "object") return null;

    const r = response as Record<string, unknown>;
    const direct = r.Subject ?? r.subject;
    if (direct && typeof direct === "object") {
        return direct as SubjectDetailApiPayload;
    }

    const data = r.data;
    if (data && typeof data === "object" && !Array.isArray(data)) {
        const nested = data as Record<string, unknown>;
        const sub = nested.Subject ?? nested.subject;
        if (sub && typeof sub === "object") {
            return sub as SubjectDetailApiPayload;
        }
        if (looksLikeSubjectPayload(nested)) {
            return nested as SubjectDetailApiPayload;
        }
    }

    if (looksLikeSubjectPayload(r)) {
        return r as SubjectDetailApiPayload;
    }

    return null;
}

function looksLikeSubjectPayload(value: Record<string, unknown>): boolean {
    if (toNumericId(value.id) === undefined) return false;
    return (
        typeof value.name === "string" ||
        typeof value.name_ar === "string" ||
        typeof value.name_en === "string" ||
        Array.isArray(value.lessons) ||
        value.lessons_count !== undefined
    );
}

function mapDoctor(raw: DoctorApiPayload): StudySubjectDoctor | null {
    const id = toNumericId(raw.id);
    const name = typeof raw.name === "string" ? raw.name.trim() : "";
    if (id === undefined || !name) return null;
    return { id, name };
}

function mapLesson(raw: LessonApiPayload): StudyLesson | null {
    const id = toNumericId(raw.id);
    if (id === undefined) return null;

    const lessonNumber =
        typeof raw.lesson_number === "string" ? raw.lesson_number.trim() : "";
    const title = typeof raw.title === "string" ? raw.title.trim() : "";
    const briefContent =
        typeof raw.brief_content === "string" ? raw.brief_content.trim() : "";

    const doctorName =
        raw.doctor && typeof raw.doctor.name === "string"
            ? raw.doctor.name.trim()
            : undefined;

    const progressRaw = raw.videos_progress;
    const videosTotal =
        Number(progressRaw?.total) || Number(raw.videos_count) || 0;
    const videosProgress = {
        completed: Number(progressRaw?.completed) || 0,
        total: videosTotal,
        percentage:
            progressRaw?.percentage !== undefined &&
            progressRaw?.percentage !== null
                ? Number(progressRaw.percentage)
                : videosTotal > 0
                  ? Math.round(
                        ((Number(progressRaw?.completed) || 0) / videosTotal) *
                            100,
                    )
                  : 0,
    };

    const allVideosCompleted = raw.all_videos_completed === true;
    const studentHasPassedLessonExam =
        raw.student_has_passed_lesson_exam === true;
    const isCompleted =
        raw.is_completed === true ||
        (allVideosCompleted && studentHasPassedLessonExam);

    return {
        id,
        lessonNumber,
        title,
        briefContent,
        videosCount: Number(raw.videos_count) || 0,
        attachmentsCount: Number(raw.attachments_count) || 0,
        isWatchCompleted: raw.is_watch_completed === true,
        allVideosCompleted,
        studentHasPassedLessonExam,
        isCompleted,
        videosProgress,
        orderIndex: Number(raw.order_index) || 0,
        isLocked: raw.is_locked === true || raw.is_locked === 1,
        canAccessLesson: raw.can_access_lesson === true || raw.can_access_lesson === 1,
        doctorName,
    };
}

function sortLessons(list: StudyLesson[]): StudyLesson[] {
    return [...list].sort((a, b) => {
        if (a.orderIndex !== b.orderIndex) return a.orderIndex - b.orderIndex;
        return a.id - b.id;
    });
}

function resolveLessonsProgress(
    raw: SubjectDetailApiPayload,
    lessons: StudyLesson[],
    isSubjectWatchCompleted: boolean,
): { completed: number; total: number; percentage: number } {
    const pr = raw.lessons_progress;
    if (
        pr &&
        (pr.percentage !== undefined ||
            pr.total !== undefined ||
            pr.completed !== undefined)
    ) {
        const total =
            Number(pr.total) || Number(raw.lessons_count) || lessons.length;
        const completed = Number(pr.completed) || 0;
        const percentage =
            pr.percentage !== undefined && pr.percentage !== null
                ? Math.min(100, Math.max(0, Number(pr.percentage)))
                : total > 0
                  ? Math.min(100, Math.round((completed / total) * 100))
                  : 0;
        return { completed, total, percentage };
    }

    if (isSubjectWatchCompleted) {
        const total = Number(raw.lessons_count) || lessons.length;
        return { completed: total, total, percentage: 100 };
    }

    const total = Number(raw.lessons_count) || lessons.length;
    const completed = lessons.filter((l) => l.isCompleted).length;
    const percentage =
        total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

    return { completed, total, percentage };
}

function mapPayloadToStudySubjectDetail(
    raw: SubjectDetailApiPayload,
    lang: string,
    fullResponse?: unknown,
): StudySubjectDetail {
    const id = toNumericId(raw.id) ?? 0;
    const about =
        typeof raw.about_subject === "string"
            ? raw.about_subject
            : typeof raw.about === "string"
              ? raw.about
              : typeof raw.description === "string"
                ? raw.description
                : "";

    const lessons = sortLessons(
        (raw.lessons ?? [])
            .map((item) => mapLesson(item))
            .filter((l): l is StudyLesson => l !== null),
    );

    const doctors = (raw.doctors ?? [])
        .map((d) => mapDoctor(d))
        .filter((d): d is StudySubjectDoctor => d !== null);

    const isSubjectWatchCompleted = raw.is_subject_watch_completed === true;
    const lessonsProgress = resolveLessonsProgress(
        raw,
        lessons,
        isSubjectWatchCompleted,
    );
    const isLocked = raw.is_locked === true || raw.is_locked === 1;
    const canAccessSubject =
        raw.can_access_subject === undefined
            ? !isLocked
            : raw.can_access_subject === true || raw.can_access_subject === 1;

    const attempt = extractSubjectExamAttempt(
        fullResponse ? { ...raw, ...(fullResponse as object) } : raw,
    );
    const examState = resolveSubjectExamUiState(attempt, {
        apiPassed: raw.student_has_passed_subject_exam === true,
        canAccessFromApi: raw.can_access_subject_exam === true,
        canRetakeFromApi:
            raw.can_retake_subject_exam === true ||
            raw.can_retake_subject_exam === 1,
    });

    return {
        id,
        title: pickTitle(raw, lang),
        description: about,
        cover: typeof raw.cover === "string" ? raw.cover : undefined,
        lessonsCount: Number(raw.lessons_count) || lessons.length,
        lessonExamsCount: Number(raw.lesson_exams_count) || 0,
        progress: lessonsProgress.percentage,
        lessonsProgress,
        isSubjectWatchCompleted,
        isLocked,
        canAccessSubject,
        hasActiveSubjectExam: raw.has_active_subject_exam === true,
        canAccessSubjectExam: raw.can_access_subject_exam === true,
        studentHasPassedSubjectExam: examState.passed,
        subjectExamStatus: examState.status,
        subjectExamIsPassed:
            attempt.isPassed === undefined ? undefined : attempt.isPassed,
        isSubjectExamUnderReview: examState.underReview,
        canRetakeSubjectExam: examState.canRetake,
        canOpenSubjectExam: examState.canOpenFinalExam,
        studyTermId: toNumericId(raw.study_term?.id),
        studyTermName:
            typeof raw.study_term?.name === "string"
                ? raw.study_term.name.trim()
                : undefined,
        doctors,
        lessons,
    };
}

export const subjectsApi = createApi({
    reducerPath: "subjectsApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["Subject"],
    endpoints: (builder) => ({
        /** GET `/subjects/{id}` → `{ data: { Subject: { …, lessons: [...] } } }`. */
        getSubjectDetail: builder.query<
            StudySubjectDetail,
            { id: string | number; lang: string }
        >({
            query: ({ id, lang }) => ({
                url: `/${BASE_PATH}/${id}`,
                method: "GET",
                headers: {
                    "Accept-Language": resolveAcceptLanguage(lang),
                },
            }),
            transformResponse: (response: unknown, _meta, arg) => {
                const lang = resolveAcceptLanguage(arg?.lang);
                const raw = unwrapSubjectPayload(response);
                if (!raw || toNumericId(raw.id) === undefined) {
                    throw new Error("Invalid subject detail response");
                }
                return mapPayloadToStudySubjectDetail(raw, lang, response);
            },
            providesTags: (_result, _err, arg) => [
                { type: "Subject", id: String(arg.id) },
            ],
        }),

        /** GET `/subjects/{id}/exam`. */
        getSubjectExam: builder.query<
            VideoExam,
            { subjectId: string | number; lang: string }
        >({
            query: ({ subjectId, lang }) => ({
                url: `/${BASE_PATH}/${subjectId}/exam`,
                method: "GET",
                headers: {
                    "Accept-Language": resolveAcceptLanguage(lang),
                },
            }),
            transformResponse: (response: unknown) => {
                const raw = unwrapExamResponse(response);
                if (!raw) throw new Error("Invalid subject exam response");
                return mapPayloadToVideoExam(raw);
            },
        }),

        /** POST `/subjects/{id}/submit-exam`. */
        submitSubjectExam: builder.mutation<
            VideoExamSubmitResult,
            {
                subjectId: string | number;
                lang: string;
                answers: VideoExamAnswerPayload[];
            }
        >({
            query: ({ subjectId, lang, answers }) => ({
                url: `/${BASE_PATH}/${subjectId}/submit-exam`,
                method: "POST",
                data: buildExamSubmitFormData(answers),
                withCsrf: true,
                headers: {
                    "Accept-Language": resolveAcceptLanguage(lang),
                },
            }),
            transformResponse: (response: unknown) =>
                unwrapSubmitExamResult(response),
            invalidatesTags: (_result, _err, arg) => [
                { type: "Subject", id: String(arg.subjectId) },
            ],
        }),
    }),
});

export const {
    useGetSubjectDetailQuery,
    useLazyGetSubjectDetailQuery,
    useLazyGetSubjectExamQuery,
    useSubmitSubjectExamMutation,
} = subjectsApi;
