/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { axiosBaseQuery } from "@/store/base/axiosBaseQuery";
import type {
  ScientificTrackCategory,
  ScientificTrackCategorySubjects,
  ScientificTrackLesson,
  ScientificTrackSubject,
  ScientificTrackSubjectDetail,
} from "@/types/scientificTrack";

const CATEGORIES_PATH = "scientific-track-categories";
const SUBJECTS_PATH = "scientific-track-subjects";

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

function asBoolean(value: unknown): boolean {
  return value === true || value === 1 || value === "1";
}

function asNonEmptyString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Raw row from GET `/scientific-track-categories`. */
type CategoryApiPayload = {
  id?: number | string;
  name?: string;
  about_category?: string;
  subjects_count?: number | string;
  is_active?: number | boolean | string;
};

/** Raw lesson inside subject detail. */
type LessonApiPayload = {
  id?: number | string;
  lesson_number?: string;
  title?: string;
  brief_content?: string;
  order_index?: number;
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
  doctor?: { id?: number | string; name?: string };
};

/** Raw subject from list or detail endpoints. */
type SubjectApiPayload = {
  id?: number | string;
  cover?: string;
  name?: string;
  about_subject?: string;
  lessons_count?: number | string;
  lesson_exams_count?: number | string;
  order_index?: number | string;
  is_active?: number | boolean | string;
  is_locked?: boolean | number;
  can_access_subject?: boolean | number;
  category?: {
    id?: number | string;
    name?: string;
  };
  lessons_progress?: {
    completed?: number;
    total?: number;
    percentage?: number;
  };
  has_active_subject_exam?: boolean | number;
  all_lessons_completed?: boolean | number;
  can_access_subject_exam?: boolean | number;
  student_has_passed_subject_exam?: boolean | number;
  lessons?: LessonApiPayload[];
};

function mapCategory(raw: CategoryApiPayload): ScientificTrackCategory | null {
  const id = toNumericId(raw.id);
  if (id === undefined) return null;

  return {
    id,
    name: asNonEmptyString(raw.name) || "—",
    aboutCategory: asNonEmptyString(raw.about_category),
    subjectsCount: Math.max(0, Number(raw.subjects_count) || 0),
    isActive: asBoolean(raw.is_active),
  };
}

function resolveLessonsProgress(raw: SubjectApiPayload, lessonsLength = 0): {
  completed: number;
  total: number;
  percentage: number;
} {
  const pr = raw.lessons_progress;
  const total =
    Math.max(
      0,
      Number(pr?.total) || Number(raw.lessons_count) || lessonsLength || 0,
    ) || 0;
  const completed = Math.max(0, Number(pr?.completed) || 0);
  let percentage = Number(pr?.percentage);
  if (Number.isNaN(percentage)) {
    percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  }
  return {
    completed,
    total,
    percentage: Math.min(100, Math.max(0, percentage)),
  };
}

function mapLesson(raw: LessonApiPayload): ScientificTrackLesson | null {
  const id = toNumericId(raw.id);
  if (id === undefined) return null;

  const progressRaw = raw.videos_progress;
  const videosTotal =
    Number(progressRaw?.total) || Number(raw.videos_count) || 0;
  const videosProgress = {
    completed: Number(progressRaw?.completed) || 0,
    total: videosTotal,
    percentage:
      progressRaw?.percentage !== undefined && progressRaw?.percentage !== null
        ? Number(progressRaw.percentage)
        : videosTotal > 0
          ? Math.round(
              ((Number(progressRaw?.completed) || 0) / videosTotal) * 100,
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
    lessonNumber: asNonEmptyString(raw.lesson_number),
    title: asNonEmptyString(raw.title),
    briefContent: asNonEmptyString(raw.brief_content),
    videosCount: Number(raw.videos_count) || 0,
    attachmentsCount: Number(raw.attachments_count) || 0,
    isWatchCompleted: raw.is_watch_completed === true,
    allVideosCompleted,
    studentHasPassedLessonExam,
    isCompleted,
    videosProgress,
    orderIndex: Number(raw.order_index) || 0,
    isLocked: asBoolean(raw.is_locked),
    canAccessLesson: asBoolean(raw.can_access_lesson),
    doctorName: asNonEmptyString(raw.doctor?.name) || undefined,
  };
}

function sortLessons(
  list: ScientificTrackLesson[],
): ScientificTrackLesson[] {
  return [...list].sort(
    (a, b) => a.orderIndex - b.orderIndex || a.id - b.id,
  );
}

function mapSubject(raw: SubjectApiPayload): ScientificTrackSubject | null {
  const id = toNumericId(raw.id);
  if (id === undefined) return null;

  const lessonsProgress = resolveLessonsProgress(raw);
  const categoryId = toNumericId(raw.category?.id);

  return {
    id,
    title: asNonEmptyString(raw.name) || "—",
    description: asNonEmptyString(raw.about_subject),
    cover: asNonEmptyString(raw.cover) || undefined,
    lessonsCount:
      lessonsProgress.total || Math.max(0, Number(raw.lessons_count) || 0),
    progress: lessonsProgress.percentage,
    lessonsProgress,
    orderIndex: Number(raw.order_index) || 0,
    isActive: asBoolean(raw.is_active),
    categoryId,
    categoryName: asNonEmptyString(raw.category?.name) || undefined,
    hasActiveSubjectExam: asBoolean(raw.has_active_subject_exam),
    allLessonsCompleted: asBoolean(raw.all_lessons_completed),
    canAccessSubjectExam: asBoolean(raw.can_access_subject_exam),
    studentHasPassedSubjectExam: asBoolean(raw.student_has_passed_subject_exam),
  };
}

function mapSubjectDetail(
  raw: SubjectApiPayload,
): ScientificTrackSubjectDetail | null {
  const id = toNumericId(raw.id);
  if (id === undefined) return null;

  const lessons = sortLessons(
    ((raw.lessons ??
      (raw as SubjectApiPayload & { Lessons?: LessonApiPayload[] }).Lessons) ??
      [])
      .map(mapLesson)
      .filter((item): item is ScientificTrackLesson => item !== null),
  );
  const lessonsProgress = resolveLessonsProgress(raw, lessons.length);

  return {
    id,
    title: asNonEmptyString(raw.name) || "—",
    description: asNonEmptyString(raw.about_subject),
    cover: asNonEmptyString(raw.cover) || undefined,
    lessonsCount:
      Number(raw.lessons_count) || lessonsProgress.total || lessons.length,
    lessonExamsCount: Math.max(0, Number(raw.lesson_exams_count) || 0),
    progress: lessonsProgress.percentage,
    lessonsProgress,
    isLocked: asBoolean(raw.is_locked),
    canAccessSubject: asBoolean(raw.can_access_subject),
    hasActiveSubjectExam: asBoolean(raw.has_active_subject_exam),
    canAccessSubjectExam: asBoolean(raw.can_access_subject_exam),
    studentHasPassedSubjectExam: asBoolean(raw.student_has_passed_subject_exam),
    allLessonsCompleted: asBoolean(raw.all_lessons_completed),
    categoryId: toNumericId(raw.category?.id),
    categoryName: asNonEmptyString(raw.category?.name) || undefined,
    lessons,
  };
}

function extractCategoriesPayload(payload: unknown): CategoryApiPayload[] {
  const p = payload as any;
  const raw = p?.data?.Categories ?? p?.data?.categories;
  return Array.isArray(raw) ? (raw as CategoryApiPayload[]) : [];
}

function extractSubjectsPayload(payload: unknown): SubjectApiPayload[] {
  const p = payload as any;
  const raw = p?.data?.Subjects ?? p?.data?.subjects;
  return Array.isArray(raw) ? (raw as SubjectApiPayload[]) : [];
}

function unwrapSubjectDetail(payload: unknown): SubjectApiPayload | null {
  const p = payload as any;
  const subject = p?.data?.Subject ?? p?.data?.subject ?? p?.Subject ?? p?.subject;
  if (subject && typeof subject === "object") {
    return subject as SubjectApiPayload;
  }
  return null;
}

function sortSubjects(list: ScientificTrackSubject[]): ScientificTrackSubject[] {
  return [...list].sort(
    (a, b) => a.orderIndex - b.orderIndex || a.id - b.id,
  );
}

export const scientificTracksApi = createApi({
  reducerPath: "scientificTracksApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "ScientificTrackCategories",
    "ScientificTrackSubjects",
    "ScientificTrackSubjectDetail",
  ],
  endpoints: (builder) => ({
    /** GET `/scientific-track-categories` → active category cards. */
    getScientificTrackCategories: builder.query<
      ScientificTrackCategory[],
      { lang: string }
    >({
      query: ({ lang }) => ({
        url: `/${CATEGORIES_PATH}`,
        method: "GET",
        headers: {
          "Accept-Language": resolveAcceptLanguage(lang),
        },
      }),
      transformResponse: (response: unknown): ScientificTrackCategory[] => {
        return extractCategoriesPayload(response)
          .map(mapCategory)
          .filter((item): item is ScientificTrackCategory => item !== null)
          .filter((item) => item.isActive);
      },
      providesTags: ["ScientificTrackCategories"],
    }),

    /**
     * GET `/scientific-track-categories/{id}/subjects`
     * → subjects for one independent scientific path category.
     */
    getScientificSubjectsByCategory: builder.query<
      ScientificTrackCategorySubjects,
      { categoryId: string | number; lang: string }
    >({
      query: ({ categoryId, lang }) => ({
        url: `/${CATEGORIES_PATH}/${categoryId}/subjects`,
        method: "GET",
        headers: {
          "Accept-Language": resolveAcceptLanguage(lang),
        },
      }),
      transformResponse: (
        response: unknown,
        _meta,
        arg,
      ): ScientificTrackCategorySubjects => {
        const subjects = sortSubjects(
          extractSubjectsPayload(response)
            .map(mapSubject)
            .filter((item): item is ScientificTrackSubject => item !== null)
            .filter((item) => item.isActive),
        );

        const fromSubject = subjects.find(
          (s) => s.categoryName || s.categoryId !== undefined,
        );
        const categoryId =
          fromSubject?.categoryId ?? toNumericId(arg.categoryId) ?? 0;

        return {
          categoryId,
          categoryName: fromSubject?.categoryName ?? "",
          subjects,
        };
      },
      providesTags: (_result, _error, arg) => [
        { type: "ScientificTrackSubjects", id: String(arg.categoryId) },
      ],
    }),

    /**
     * GET `/scientific-track-subjects/{id}`
     * → subject detail + lessons (get-scientific-subject-lessons).
     */
    getScientificSubjectDetail: builder.query<
      ScientificTrackSubjectDetail,
      { subjectId: string | number; lang: string }
    >({
      query: ({ subjectId, lang }) => ({
        url: `/${SUBJECTS_PATH}/${subjectId}`,
        method: "GET",
        headers: {
          "Accept-Language": resolveAcceptLanguage(lang),
        },
      }),
      transformResponse: (response: unknown): ScientificTrackSubjectDetail => {
        const raw = unwrapSubjectDetail(response);
        const mapped = raw ? mapSubjectDetail(raw) : null;
        if (!mapped) {
          throw new Error("Invalid scientific track subject payload");
        }
        return mapped;
      },
      providesTags: (_result, _error, arg) => [
        { type: "ScientificTrackSubjectDetail", id: String(arg.subjectId) },
      ],
    }),
  }),
});

export const {
  useGetScientificTrackCategoriesQuery,
  useGetScientificSubjectsByCategoryQuery,
  useGetScientificSubjectDetailQuery,
} = scientificTracksApi;
