/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { axiosBaseQuery } from "@/store/base/axiosBaseQuery";
import type {
    StudyLesson,
    StudySubjectDetail,
    StudySubjectDoctor,
} from "@/types/studySubjectDetail";

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
    }

    return null;
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

    return {
        id,
        lessonNumber,
        title,
        briefContent,
        videosCount: Number(raw.videos_count) || 0,
        attachmentsCount: Number(raw.attachments_count) || 0,
        isWatchCompleted: raw.is_watch_completed === true,
        orderIndex: Number(raw.order_index) || 0,
        doctorName,
    };
}

function sortLessons(list: StudyLesson[]): StudyLesson[] {
    return [...list].sort((a, b) => {
        if (a.orderIndex !== b.orderIndex) return a.orderIndex - b.orderIndex;
        return a.id - b.id;
    });
}

function resolveSubjectProgress(
    lessons: StudyLesson[],
    isSubjectWatchCompleted: boolean,
): number {
    if (isSubjectWatchCompleted) return 100;
    if (lessons.length === 0) return 0;
    const completed = lessons.filter((l) => l.isWatchCompleted).length;
    return Math.min(100, Math.round((completed / lessons.length) * 100));
}

function mapPayloadToStudySubjectDetail(
    raw: SubjectDetailApiPayload,
    lang: string,
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

    return {
        id,
        title: pickTitle(raw, lang),
        description: about,
        cover: typeof raw.cover === "string" ? raw.cover : undefined,
        lessonsCount: Number(raw.lessons_count) || lessons.length,
        lessonExamsCount: Number(raw.lesson_exams_count) || 0,
        progress: resolveSubjectProgress(lessons, isSubjectWatchCompleted),
        isSubjectWatchCompleted,
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
                return mapPayloadToStudySubjectDetail(raw, lang);
            },
            providesTags: (_result, _err, arg) => [
                { type: "Subject", id: String(arg.id) },
            ],
        }),
    }),
});

export const { useGetSubjectDetailQuery } = subjectsApi;
