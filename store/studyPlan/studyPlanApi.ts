/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { axiosBaseQuery } from "@/store/base/axiosBaseQuery";
import type {
  StudyPlan,
  StudyPlanAcademicYear,
  StudyPlanDateRange,
  StudyPlanMakeupPeriod,
  StudyProgramLesson,
  StudyProgramSubject,
  StudyProgramTerm,
  StudyProgramYear,
} from "@/types/studyPlan";

const STUDY_PLAN_PATH = "study-plan";

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

function asNonEmptyString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function mapDateRange(raw: {
  start_date?: unknown;
  end_date?: unknown;
  start_date_hijri?: unknown;
  end_date_hijri?: unknown;
}): StudyPlanDateRange {
  return {
    startDate: asNonEmptyString(raw.start_date),
    endDate: asNonEmptyString(raw.end_date),
    startDateHijri: asNonEmptyString(raw.start_date_hijri),
    endDateHijri: asNonEmptyString(raw.end_date_hijri),
  };
}

function mapEnrollment(raw: unknown): StudyPlanDateRange | null {
  if (!raw || typeof raw !== "object") return null;
  return mapDateRange(raw as Record<string, unknown>);
}

function mapAcademicYear(raw: any): StudyPlanAcademicYear | null {
  const sequence = toNumericId(raw?.sequence);
  if (sequence === undefined) return null;
  return {
    sequence,
    ...mapDateRange(raw),
  };
}

function mapMakeupPeriod(raw: any): StudyPlanMakeupPeriod | null {
  const programYear = toNumericId(raw?.program_year);
  if (programYear === undefined) return null;
  return {
    programYear,
    ...mapDateRange(raw),
  };
}

function unwrapStudyPlan(payload: unknown): any | null {
  const p = payload as any;
  const plan =
    p?.data?.StudyPlan ?? p?.data?.studyPlan ?? p?.StudyPlan ?? p?.studyPlan;
  if (plan && typeof plan === "object") return plan;
  return null;
}

function mapStudyPlan(raw: any): StudyPlan | null {
  const id = toNumericId(raw?.id);
  if (id === undefined) return null;

  const academicYears = Array.isArray(raw?.academic_years)
    ? raw.academic_years
        .map(mapAcademicYear)
        .filter((item: StudyPlanAcademicYear | null): item is StudyPlanAcademicYear => item !== null)
        .sort((a: StudyPlanAcademicYear, b: StudyPlanAcademicYear) => a.sequence - b.sequence)
    : [];

  const makeupExamPeriods = Array.isArray(raw?.makeup_exam_periods)
    ? raw.makeup_exam_periods
        .map(mapMakeupPeriod)
        .filter((item: StudyPlanMakeupPeriod | null): item is StudyPlanMakeupPeriod => item !== null)
        .sort((a: StudyPlanMakeupPeriod, b: StudyPlanMakeupPeriod) => a.programYear - b.programYear)
    : [];

  return {
    id,
    name: asNonEmptyString(raw?.name),
    enrollment: mapEnrollment(raw?.enrollment),
    academicYears,
    makeupExamPeriods,
  };
}

function mapProgramLesson(raw: any): StudyProgramLesson | null {
  const id = toNumericId(raw?.id);
  const title = asNonEmptyString(raw?.title);
  if (id === undefined || !title) return null;
  return { id, title };
}

function mapProgramSubject(raw: any): StudyProgramSubject | null {
  const id = toNumericId(raw?.id);
  const name = asNonEmptyString(raw?.name);
  if (id === undefined || !name) return null;

  const lessons = Array.isArray(raw?.lessons)
    ? raw.lessons
        .map(mapProgramLesson)
        .filter(
          (item: StudyProgramLesson | null): item is StudyProgramLesson =>
            item !== null,
        )
    : [];

  return {
    id,
    name,
    orderIndex: toNumericId(raw?.order_index) ?? id,
    lessonsCount: toNumericId(raw?.lessons_count) ?? lessons.length,
    videosCount: toNumericId(raw?.videos_count) ?? 0,
    lessons,
  };
}

function mapProgramTerm(raw: any): StudyProgramTerm | null {
  const id = toNumericId(raw?.id);
  const name = asNonEmptyString(raw?.name);
  if (id === undefined || !name) return null;

  const subjects = Array.isArray(raw?.subjects)
    ? raw.subjects
        .map(mapProgramSubject)
        .filter(
          (item: StudyProgramSubject | null): item is StudyProgramSubject =>
            item !== null,
        )
        .sort(
          (a: StudyProgramSubject, b: StudyProgramSubject) =>
            a.orderIndex - b.orderIndex,
        )
    : [];

  return {
    id,
    name,
    subjectsCount: toNumericId(raw?.subjects_count) ?? subjects.length,
    lessonsCount: toNumericId(raw?.lessons_count) ?? 0,
    subjects,
  };
}

function mapProgramYear(raw: any): StudyProgramYear | null {
  const id = toNumericId(raw?.id);
  const name = asNonEmptyString(raw?.name);
  if (id === undefined || !name) return null;

  const terms = Array.isArray(raw?.study_terms)
    ? raw.study_terms
        .map(mapProgramTerm)
        .filter(
          (item: StudyProgramTerm | null): item is StudyProgramTerm =>
            item !== null,
        )
    : [];

  return {
    id,
    name,
    programSequence: toNumericId(raw?.program_sequence) ?? id,
    terms,
  };
}

function extractStudyProgram(payload: unknown): StudyProgramYear[] {
  const p = payload as any;
  const raw =
    p?.data?.StudyProgram ??
    p?.data?.studyProgram ??
    p?.StudyProgram ??
    p?.studyProgram;
  if (!Array.isArray(raw)) return [];
  return raw
    .map(mapProgramYear)
    .filter(
      (item: StudyProgramYear | null): item is StudyProgramYear =>
        item !== null,
    )
    .sort(
      (a: StudyProgramYear, b: StudyProgramYear) =>
        a.programSequence - b.programSequence,
    );
}

export const studyPlanApi = createApi({
  reducerPath: "studyPlanApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["StudyPlan", "StudyProgram"],
  endpoints: (builder) => ({
    /** GET `/study-plan` → program timeline dates. */
    getStudyPlan: builder.query<StudyPlan, { lang: string }>({
      query: ({ lang }) => ({
        url: `/${STUDY_PLAN_PATH}`,
        method: "GET",
        headers: {
          "Accept-Language": resolveAcceptLanguage(lang),
        },
      }),
      transformResponse: (response: unknown): StudyPlan => {
        const raw = unwrapStudyPlan(response);
        const mapped = raw ? mapStudyPlan(raw) : null;
        if (!mapped) {
          throw new Error("Invalid study plan payload");
        }
        return mapped;
      },
      providesTags: ["StudyPlan"],
    }),

    /** GET `/study-program` → years, terms, subjects, and lessons. */
    getStudyProgram: builder.query<StudyProgramYear[], { lang: string }>({
      query: ({ lang }) => ({
        url: "/study-program",
        method: "GET",
        headers: {
          "Accept-Language": resolveAcceptLanguage(lang),
        },
      }),
      transformResponse: (response: unknown): StudyProgramYear[] => {
        return extractStudyProgram(response);
      },
      providesTags: ["StudyProgram"],
    }),
  }),
});

export const { useGetStudyPlanQuery, useGetStudyProgramQuery } = studyPlanApi;
