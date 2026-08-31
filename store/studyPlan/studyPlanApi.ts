/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { axiosBaseQuery } from "@/store/base/axiosBaseQuery";
import type {
  StudyPlan,
  StudyPlanAcademicYear,
  StudyPlanDateRange,
  StudyPlanMakeupPeriod,
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

export const studyPlanApi = createApi({
  reducerPath: "studyPlanApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["StudyPlan"],
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
  }),
});

export const { useGetStudyPlanQuery } = studyPlanApi;
