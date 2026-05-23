/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from "@reduxjs/toolkit/query/react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import Cookies from "js-cookie";
import { axiosBaseQuery } from "@/store/base/axiosBaseQuery";
import type { StudyTerm } from "@/types/studyTerm";
import type { StudySubject, StudyTermDetail } from "@/types/studySubject";

const BASE_PATH = "study-terms";

/** Match auth-style `Accept-Language`: URL `lang` first, then cookie, then `ar`. */
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

/** Payload from GET `/study-terms` (student-api v1). */
export type StudyTermApiPayload = {
    id: number | string;
    name?: string;
    name_ar?: string;
    name_en?: string;
    about_term?: string;
    subjects_count?: number;
    lessons_count?: number;
    progress?: number;
    progress_percent?: number;
    completion_percentage?: number;
    term_progress?: number;
    is_completed?: number | boolean;
    is_term_completed?: number | boolean;
    is_term_watch_completed?: number | boolean;
    is_active?: number | boolean;
    is_current?: number | boolean;
    subjects?: SubjectApiPayload[];
    academic_year?: {
        id?: number;
        name?: string;
        name_ar?: string;
        name_en?: string;
    };
};

export type SubjectApiPayload = {
    id: number | string;
    name?: string;
    name_ar?: string;
    name_en?: string;
    cover?: string;
    about_subject?: string;
    about?: string;
    description?: string;
    lessons_count?: number;
    progress?: number;
    order_index?: number;
    is_active?: number | boolean;
    study_term?: {
        id?: number | string;
        name?: string;
    };
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

function pickAcademicYearLabel(
    term: StudyTermApiPayload,
    lang: string,
): string | undefined {
    const ay = term.academic_year;
    if (!ay || typeof ay !== "object") return undefined;
    if (lang === "en") {
        const n = ay.name_en ?? ay.name;
        return typeof n === "string" && n.trim() ? n.trim() : undefined;
    }
    const n = ay.name_ar ?? ay.name;
    return typeof n === "string" && n.trim() ? n.trim() : undefined;
}

function resolveTermProgress(raw: StudyTermApiPayload): number {
    const value =
        raw.progress ??
        raw.progress_percent ??
        raw.completion_percentage ??
        raw.term_progress;
    const n = Number(value);
    if (Number.isNaN(n)) return 0;
    return Math.min(100, Math.max(0, n));
}

function resolveTermCompleted(
    raw: StudyTermApiPayload,
    progress: number,
): boolean {
    if (
        raw.is_completed === true ||
        raw.is_completed === 1 ||
        raw.is_term_completed === true ||
        raw.is_term_completed === 1 ||
        raw.is_term_watch_completed === true ||
        raw.is_term_watch_completed === 1
    ) {
        return true;
    }
    return progress >= 100;
}

function mapPayloadToStudyTerm(
    raw: StudyTermApiPayload,
    lang: string,
): StudyTerm {
    const id = toNumericId(raw.id) ?? 0;
    const about = typeof raw.about_term === "string" ? raw.about_term : "";
    const active =
        raw.is_active === undefined
            ? true
            : raw.is_active === 1 || raw.is_active === true;
    const isCurrent =
        raw.is_current === 1 || raw.is_current === true ? true : undefined;
    const progress = resolveTermProgress(raw);
    const isCompleted = resolveTermCompleted(raw, progress);

    return {
        id,
        title: pickTitle(raw, lang),
        progress: isCompleted ? 100 : progress,
        isCompleted,
        materialsCount: Number(raw.subjects_count) || 0,
        lessonsCount: Number(raw.lessons_count) || 0,
        shortDescription: about,
        description: about,
        isActive: active,
        isCurrent,
        academicYearLabel: pickAcademicYearLabel(raw, lang),
    };
}

function mapPayloadToStudySubject(
    raw: SubjectApiPayload,
    lang: string,
): StudySubject | null {
    const id = toNumericId(raw.id);
    if (id === undefined) return null;
    const about =
        typeof raw.about_subject === "string"
            ? raw.about_subject
            : typeof raw.about === "string"
              ? raw.about
              : typeof raw.description === "string"
                ? raw.description
                : "";
    const active =
        raw.is_active === undefined
            ? true
            : raw.is_active === 1 || raw.is_active === true;

    return {
        id,
        title: pickTitle(raw, lang),
        description: about,
        cover: typeof raw.cover === "string" ? raw.cover : undefined,
        lessonsCount: Number(raw.lessons_count) || 0,
        progress: Number(raw.progress) || 0,
        orderIndex: Number(raw.order_index) || 0,
        isActive: active,
    };
}

function mapSubjectsPayload(
    list: SubjectApiPayload[] | undefined,
    lang: string,
): StudySubject[] {
    if (!list?.length) return [];
    return list
        .map((item) => mapPayloadToStudySubject(item, lang))
        .filter((s): s is StudySubject => s !== null);
}

function unwrapRawStudyTerms(response: unknown): StudyTermApiPayload[] {
    if (!response || typeof response !== "object") return [];
    if (Array.isArray(response)) return response as StudyTermApiPayload[];

    const r = response as Record<string, unknown>;

    if (Array.isArray(r.data)) return r.data as StudyTermApiPayload[];

    if (Array.isArray(r.studyTerms)) {
        return r.studyTerms as StudyTermApiPayload[];
    }

    const data = r.data;
    if (data && typeof data === "object" && !Array.isArray(data)) {
        const nested = data as Record<string, unknown>;
        const camel = nested.studyTerms;
        if (Array.isArray(camel)) return camel as StudyTermApiPayload[];
        const pascal = nested.StudyTerms;
        if (Array.isArray(pascal)) return pascal as StudyTermApiPayload[];
        const snake = nested.study_terms;
        if (Array.isArray(snake)) return snake as StudyTermApiPayload[];
    }

    return [];
}

function isSubjectLike(item: unknown): item is SubjectApiPayload {
    if (!item || typeof item !== "object") return false;
    const rec = item as Record<string, unknown>;
    if (toNumericId(rec.id) === undefined) return false;
    return (
        "name" in rec ||
        "name_ar" in rec ||
        "name_en" in rec ||
        "about_subject" in rec ||
        "lessons_count" in rec
    );
}

function isTermLike(item: unknown): item is StudyTermApiPayload {
    if (!item || typeof item !== "object") return false;
    const rec = item as Record<string, unknown>;
    if (toNumericId(rec.id) === undefined) return false;
    return (
        "about_term" in rec ||
        "subjects_count" in rec ||
        "is_current" in rec ||
        "academic_year" in rec ||
        "name" in rec ||
        "name_ar" in rec ||
        "name_en" in rec
    );
}

function unwrapSubjectsArray(response: unknown): SubjectApiPayload[] {
    if (!response || typeof response !== "object") return [];
    if (Array.isArray(response)) {
        return response.filter(isSubjectLike) as SubjectApiPayload[];
    }

    const r = response as Record<string, unknown>;

    const direct =
        r.Subjects ?? r.subjects ?? r.study_subjects ?? r.StudySubjects;
    if (Array.isArray(direct)) {
        return direct as SubjectApiPayload[];
    }

    const data = r.data;
    if (Array.isArray(data)) {
        return data.filter(isSubjectLike) as SubjectApiPayload[];
    }
    if (data && typeof data === "object") {
        const nested = data as Record<string, unknown>;
        const nestedList =
            nested.Subjects ??
            nested.subjects ??
            nested.study_subjects ??
            nested.StudySubjects ??
            nested.data;
        if (Array.isArray(nestedList)) {
            return nestedList.filter(isSubjectLike) as SubjectApiPayload[];
        }
        const term = nested.study_term ?? nested.studyTerm ?? nested.StudyTerm;
        if (term && typeof term === "object") {
            const termRec = term as StudyTermApiPayload;
            if (Array.isArray(termRec.subjects)) return termRec.subjects;
        }
    }

    return [];
}

function filterSubjectsByTermId(
    list: SubjectApiPayload[],
    termId: string | number,
): SubjectApiPayload[] {
    const termIdNum = toNumericId(termId);
    return list.filter((item) => {
        const st = item.study_term;
        if (!st || typeof st !== "object") return false;
        const stId = toNumericId(st.id);
        if (termIdNum !== undefined && stId !== undefined) {
            return stId === termIdNum;
        }
        return String(st.id) === String(termId);
    });
}

function sortSubjects(list: StudySubject[]): StudySubject[] {
    return [...list].sort((a, b) => a.orderIndex - b.orderIndex || a.id - b.id);
}

function unwrapStudyTermPayload(
    response: unknown,
): StudyTermApiPayload | undefined {
    if (!response || typeof response !== "object") return undefined;
    const r = response as Record<string, unknown>;

    if (isTermLike(r)) return r as StudyTermApiPayload;

    const d = r.data;
    if (!d || typeof d !== "object") return undefined;

    if (isTermLike(d)) return d as StudyTermApiPayload;

    const nested = d as Record<string, unknown>;
    const wrapped =
        nested.studyTerm ??
        nested.StudyTerm ??
        nested.study_term;
    if (wrapped && isTermLike(wrapped)) return wrapped as StudyTermApiPayload;

    const list = nested.study_terms;
    if (Array.isArray(list) && list[0] && isTermLike(list[0])) {
        return list[0] as StudyTermApiPayload;
    }

    return undefined;
}

function findTermInList(
    list: StudyTermApiPayload[],
    id: string | number,
): StudyTermApiPayload | undefined {
    const idNum = toNumericId(id);
    return list.find((item) => {
        const itemId = toNumericId(item.id);
        if (idNum !== undefined && itemId !== undefined) return itemId === idNum;
        return String(item.id) === String(id);
    });
}

type TermDetailBaseQuery = (
    arg: {
        url: string;
        method: "GET";
        headers: Record<string, string>;
    },
) => Promise<{ data?: unknown; error?: unknown }>;

async function fetchSubjectsForTerm(
    baseQuery: TermDetailBaseQuery,
    id: string | number,
    lang: string,
): Promise<StudySubject[]> {
    const headers = { "Accept-Language": lang };
    /** Backend: GET `/study-terms/{id}/subjects` → `{ data: { Subjects: [...] } }`. */
    const paths = [
        `/${BASE_PATH}/${id}/subjects`,
        `/subjects?study_term_id=${id}`,
        `/subjects?study_term=${id}`,
        "/subjects",
    ];

    for (const url of paths) {
        const res = await baseQuery({ url, method: "GET", headers });
        if (res.error) continue;

        let raw = unwrapSubjectsArray(res.data);
        const isGlobalSubjectsList =
            url === "/subjects" ||
            url.startsWith("/subjects?") ||
            raw.some((s) => s.study_term);
        if (isGlobalSubjectsList) {
            raw = filterSubjectsByTermId(raw, id);
        }

        const subjects = sortSubjects(mapSubjectsPayload(raw, lang));
        if (subjects.length > 0) return subjects;
    }

    return [];
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
                    "Accept-Language": resolveAcceptLanguage(lang),
                },
            }),
            transformResponse: (response: unknown, _meta, arg) => {
                const list = unwrapRawStudyTerms(response);
                const resolvedLang = resolveAcceptLanguage(arg?.lang);
                return list
                    .map((item) => mapPayloadToStudyTerm(item, resolvedLang))
                    .sort((a, b) => a.id - b.id);
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

        getStudyTermById: builder.query<
            StudyTerm,
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
                const raw =
                    unwrapStudyTermPayload(response) ??
                    unwrapRawStudyTerms(response)[0];
                const id = toNumericId(raw?.id);
                if (!raw || id === undefined) {
                    throw new Error("Invalid study term response");
                }
                return mapPayloadToStudyTerm(raw, lang);
            },
            providesTags: (_result, _err, arg) => [
                { type: "StudyTerm", id: String(arg.id) },
            ],
        }),

        /** Term header + subjects; falls back to list when detail endpoint fails. */
        getStudyTermDetail: builder.query<
            StudyTermDetail,
            { id: string | number; lang: string }
        >({
            async queryFn(arg, _api, _extra, baseQuery) {
                const lang = resolveAcceptLanguage(arg.lang);
                const headers = { "Accept-Language": lang };
                let term: StudyTerm | null = null;
                let subjects: StudySubject[] = [];

                const detailRes = await baseQuery({
                    url: `/${BASE_PATH}/${arg.id}`,
                    method: "GET",
                    headers,
                });

                if (!detailRes.error) {
                    const termRaw = unwrapStudyTermPayload(detailRes.data);
                    if (termRaw) {
                        term = mapPayloadToStudyTerm(termRaw, lang);
                        subjects = sortSubjects(
                            mapSubjectsPayload(
                                termRaw.subjects ??
                                    unwrapSubjectsArray(detailRes.data),
                                lang,
                            ),
                        );
                    }
                }

                if (!term) {
                    const listRes = await baseQuery({
                        url: `/${BASE_PATH}`,
                        method: "GET",
                        headers,
                    });
                    if (listRes.error) {
                        return {
                            error: listRes.error as FetchBaseQueryError,
                        };
                    }
                    const termRaw = findTermInList(
                        unwrapRawStudyTerms(listRes.data),
                        arg.id,
                    );
                    if (!termRaw) {
                        return {
                            error: {
                                status: 404,
                                data: "Study term not found",
                            },
                        };
                    }
                    term = mapPayloadToStudyTerm(termRaw, lang);
                }

                subjects = await fetchSubjectsForTerm(
                    baseQuery as TermDetailBaseQuery,
                    arg.id,
                    lang,
                );

                if (subjects.length === 0 && detailRes.data) {
                    const termRaw = unwrapStudyTermPayload(detailRes.data);
                    if (termRaw?.subjects?.length) {
                        subjects = sortSubjects(
                            mapSubjectsPayload(termRaw.subjects, lang),
                        );
                    } else {
                        const embedded = unwrapSubjectsArray(detailRes.data);
                        if (embedded.length > 0) {
                            subjects = sortSubjects(
                                mapSubjectsPayload(embedded, lang),
                            );
                        }
                    }
                }

                return {
                    data: {
                        ...term,
                        subjects,
                    },
                };
            },
            providesTags: (_result, _err, arg) => [
                { type: "StudyTerm", id: String(arg.id) },
            ],
        }),
    }),
});

export const {
    useGetStudyTermsQuery,
    useLazyGetStudyTermsQuery,
    useGetStudyTermByIdQuery,
    useLazyGetStudyTermByIdQuery,
    useGetStudyTermDetailQuery,
} = studyTermsApi;
