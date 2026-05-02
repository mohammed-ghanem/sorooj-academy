import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/store/base/axiosBaseQuery";
import type { StudyTerm } from "@/types/studyTerm";

/** Align with backend when the real API is wired (e.g. `study-terms` vs `study-topics`). */
const BASE_PATH = "study-terms";

function unwrapList(response: unknown): StudyTerm[] {
  if (Array.isArray(response)) return response as StudyTerm[];
  const r = response as { data?: unknown };
  return Array.isArray(r?.data) ? (r.data as StudyTerm[]) : [];
}

function unwrapOne(response: unknown): StudyTerm | undefined {
  if (response && typeof response === "object" && "id" in (response as object)) {
    return response as StudyTerm;
  }
  const r = response as { data?: unknown };
  if (r?.data && typeof r.data === "object" && r.data !== null && "id" in r.data) {
    return r.data as StudyTerm;
  }
  return undefined;
}

export const studyTermsApi = createApi({
  reducerPath: "studyTermsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["StudyTerm"],
  endpoints: (builder) => ({
    getStudyTerms: builder.query<StudyTerm[], void>({
      query: () => ({
        url: `/${BASE_PATH}`,
        method: "GET",
      }),
      transformResponse: (response: unknown) => unwrapList(response),
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

    getStudyTermById: builder.query<StudyTerm, string | number>({
      query: (id) => ({
        url: `/${BASE_PATH}/${id}`,
        method: "GET",
      }),
      transformResponse: (response: unknown) => {
        const term = unwrapOne(response);
        if (!term) {
          throw new Error("Invalid study term response");
        }
        return term;
      },
      providesTags: (_result, _err, id) => [{ type: "StudyTerm", id: String(id) }],
    }),
  }),
});

export const { useGetStudyTermsQuery, useGetStudyTermByIdQuery } = studyTermsApi;
