import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/store/base/axiosBaseQuery";
import type { StudyTerm } from "@/types/studyTerm";

const BASE_PATH = "study-terms";

/** Payload from GET `/study-terms` (fields used on the frontend). `is_current` reserved for enrollment. */
type StudyTermApiPayload = {
  id: number;
  name?: string;
  name_ar?: string;
  name_en?: string;
  about_term?: string;
  subjects_count?: number;
  lessons_count?: number;
  is_active?: number | boolean;
};

function pickTitle(term: StudyTermApiPayload, lang: string): string {
  const n = lang === "en" ? term.name_en : lang === "ar" ? term.name_ar : "";
  return (
    typeof n === "string" && n.trim() !== ""
      ? n
      : (term.name ?? term.name_ar ?? term.name_en ?? "")
  ).trim();
}

function mapPayloadToStudyTerm(
  raw: StudyTermApiPayload,
  lang: string,
): StudyTerm {
  const about = typeof raw.about_term === "string" ? raw.about_term : "";
  const active =
    raw.is_active === undefined
      ? true
      : raw.is_active === 1 || raw.is_active === true;

  return {
    id: Number(raw.id),
    title: pickTitle(raw, lang),
    /** Placeholder until backend exposes student progress */
    progress: 0,
    materialsCount: Number(raw.subjects_count) || 0,
    lessonsCount: Number(raw.lessons_count) || 0,
    shortDescription: about,
    description: about,
    isActive: active,
  };
}

function unwrapRawStudyTerms(response: unknown): StudyTermApiPayload[] {
  if (!response || typeof response !== "object") return [];
  if (Array.isArray(response)) return response as StudyTermApiPayload[];

  const r = response as Record<string, unknown>;

  if (Array.isArray(r.data)) return r.data as StudyTermApiPayload[];

  const data = r.data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const nested = data as Record<string, unknown>;
    const a = nested.StudyTerms;
    if (Array.isArray(a)) return a as StudyTermApiPayload[];
    const b = nested.study_terms;
    if (Array.isArray(b)) return b as StudyTermApiPayload[];
  }

  return [];
}

function unwrapStudyTermPayload(
  response: unknown,
): StudyTermApiPayload | undefined {
  if (!response || typeof response !== "object") return undefined;
  const r = response as Record<string, unknown>;

  const top = r as StudyTermApiPayload;
  if (typeof top.id === "number") return top;

  const d = r.data;
  if (!d || typeof d !== "object") return undefined;

  const dataObj = d as StudyTermApiPayload;
  if (typeof dataObj.id === "number") return dataObj;

  const nested = d as Record<string, unknown>;
  const wrapped = nested.StudyTerm ?? nested.study_term;
  if (
    wrapped &&
    typeof wrapped === "object" &&
    typeof (wrapped as StudyTermApiPayload).id === "number"
  ) {
    return wrapped as StudyTermApiPayload;
  }

  return undefined;
}

export const studyTermsApi = createApi({
  reducerPath: "studyTermsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["StudyTerm"],
  endpoints: (builder) => ({
    getStudyTerms: builder.query<StudyTerm[], { lang: string }>({
      query: ({ lang }) => ({
        url: `/${BASE_PATH}`,
        method: "GET",
        headers: {
          "Accept-Language": lang,
        },
      }),
      transformResponse: (response: unknown, _meta, arg) => {
        const list = unwrapRawStudyTerms(response);
        const lang = arg?.lang ?? "ar";
        return list.map((item) => mapPayloadToStudyTerm(item, lang));
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "StudyTerm" as const,
                id: String(id),
              })),
              { type: "StudyTerm", id: "LIST" },
            ]
          : [{ type: "StudyTerm", id: "LIST" }],
    }),

    /** Detail fetch (optional); uses static progress 0 until the API exposes progress per student. */
    getStudyTermById: builder.query<
      StudyTerm,
      { id: string | number; lang: string }
    >({
      query: ({ id, lang }) => ({
        url: `/${BASE_PATH}/${id}`,
        method: "GET",
        headers: {
          "Accept-Language": lang,
        },
      }),
      transformResponse: (response: unknown, _meta, arg) => {
        const raw =
          unwrapStudyTermPayload(response) ?? unwrapRawStudyTerms(response)[0];
        if (!raw || typeof raw.id !== "number") {
          throw new Error("Invalid study term response");
        }
        return mapPayloadToStudyTerm(raw, arg.lang);
      },
      providesTags: (_result, _err, arg) => [
        { type: "StudyTerm", id: String(arg.id) },
      ],
    }),
  }),
});

export const { useGetStudyTermsQuery, useGetStudyTermByIdQuery } =
  studyTermsApi;
