/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { axiosBaseQuery } from "@/store/base/axiosBaseQuery";

const authCookieOptions = {
  expires: 7,
  secure: process.env.NODE_ENV === "production",
  path: "/",
} as const;

/** Match `studyTermsApi`: URL `lang` first, then cookie, then `ar`. */
function resolveAcceptLanguage(lang?: string): string {
  const fromArg =
    typeof lang === "string" && lang.trim() !== "" ? lang.trim() : "";
  return fromArg || Cookies.get("lang") || "ar";
}

function persistUserFromProgramResponse(payload: unknown) {
  const p = payload as {
    data?: { user?: unknown; student?: unknown };
    user?: unknown;
  };
  const user =
    (p?.data?.user && typeof p.data.user === "object" ? p.data.user : null) ??
    (p?.data?.student && typeof p.data.student === "object"
      ? p.data.student
      : null) ??
    (p?.user && typeof p.user === "object" ? p.user : null);
  if (user) {
    try {
      Cookies.set("user", JSON.stringify(user), authCookieOptions);
    } catch {
      /* ignore */
    }
  }
}

export type HomeStatistic = {
  key: string;
  value: number;
  label: string;
};

function toNumericValue(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (!Number.isNaN(n)) return n;
  }
  return 0;
}

function asNonEmptyString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function mapStatistic(raw: any): HomeStatistic | null {
  const key = asNonEmptyString(raw?.key);
  const label = asNonEmptyString(raw?.label);
  if (!key && !label) return null;
  return {
    key: key || label,
    value: toNumericValue(raw?.value),
    label: label || key,
  };
}

function extractStatistics(payload: unknown): HomeStatistic[] {
  const p = payload as any;
  const raw = p?.data?.Statistics ?? p?.data?.statistics;
  if (!Array.isArray(raw)) return [];
  return raw
    .map(mapStatistic)
    .filter((item: HomeStatistic | null): item is HomeStatistic => item !== null);
}

export type HomeFeature = {
  id: number;
  title: string;
  description: string;
  icon: string;
};

function toNumericId(value: unknown): number | undefined {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (!Number.isNaN(n)) return n;
  }
  return undefined;
}

function mapHomeFeature(raw: any): HomeFeature | null {
  const id = toNumericId(raw?.id);
  const title = asNonEmptyString(raw?.title);
  if (id === undefined || !title) return null;

  return {
    id,
    title,
    description: asNonEmptyString(raw?.description),
    icon: asNonEmptyString(raw?.icon),
  };
}

function extractHomeFeatures(payload: unknown): HomeFeature[] {
  const p = payload as any;
  const raw = p?.data?.HomeFeatures ?? p?.data?.homeFeatures ?? p?.data?.features;
  if (!Array.isArray(raw)) return [];
  return raw
    .map(mapHomeFeature)
    .filter((item: HomeFeature | null): item is HomeFeature => item !== null)
    .sort((a: HomeFeature, b: HomeFeature) => a.id - b.id);
}

export type HomeGoal = {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: string;
};

function mapHomeGoal(raw: any): HomeGoal | null {
  const id = toNumericId(raw?.id);
  const title = asNonEmptyString(raw?.title);
  if (id === undefined || !title) return null;

  return {
    id,
    title,
    description: asNonEmptyString(raw?.description),
    image: asNonEmptyString(raw?.image),
    icon: asNonEmptyString(raw?.icon),
  };
}

function extractHomeGoals(payload: unknown): HomeGoal[] {
  const p = payload as any;
  const raw = p?.data?.HomeGoals ?? p?.data?.homeGoals ?? p?.data?.goals;
  if (!Array.isArray(raw)) return [];
  return raw
    .map(mapHomeGoal)
    .filter((item: HomeGoal | null): item is HomeGoal => item !== null)
    .sort((a: HomeGoal, b: HomeGoal) => a.id - b.id);
}

export type HomeMethodology = {
  id: number;
  title: string;
  description: string;
  icon: string;
};

function mapHomeMethodology(raw: any): HomeMethodology | null {
  const id = toNumericId(raw?.id);
  const title = asNonEmptyString(raw?.title);
  if (id === undefined || !title) return null;

  return {
    id,
    title,
    description: asNonEmptyString(raw?.description),
    icon: asNonEmptyString(raw?.icon),
  };
}

function extractHomeMethodologies(payload: unknown): HomeMethodology[] {
  const p = payload as any;
  const raw =
    p?.data?.homeMethodologies ??
    p?.data?.HomeMethodologies ??
    p?.data?.methodologies;
  if (!Array.isArray(raw)) return [];
  return raw
    .map(mapHomeMethodology)
    .filter(
      (item: HomeMethodology | null): item is HomeMethodology => item !== null,
    )
    .sort((a: HomeMethodology, b: HomeMethodology) => a.id - b.id);
}

export type HomeStudyLevel = {
  id: number;
  orderIndex: number;
  title: string;
  description: string;
  image: string;
};

function mapHomeStudyLevel(raw: any): HomeStudyLevel | null {
  const id = toNumericId(raw?.id);
  const title = asNonEmptyString(raw?.title);
  if (id === undefined || !title) return null;

  return {
    id,
    orderIndex: toNumericId(raw?.order_index) ?? id,
    title,
    description: asNonEmptyString(raw?.description),
    image: asNonEmptyString(raw?.image),
  };
}

export type EnrollmentStatus = {
  isEnrollmentOpen: boolean;
  startYear: number | null;
  endYear: number | null;
};

function asBooleanFlag(value: unknown): boolean {
  if (value === true || value === 1 || value === "1" || value === "true") {
    return true;
  }
  return false;
}

function asYear(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (!Number.isNaN(n)) return n;
  }
  return null;
}

function extractEnrollmentStatus(payload: unknown): EnrollmentStatus {
  const p = payload as any;
  const d = p?.data ?? p ?? {};
  return {
    isEnrollmentOpen: asBooleanFlag(d.is_enrollment_open),
    startYear: asYear(d.start_year),
    endYear: asYear(d.end_year),
  };
}

function extractHomeStudyLevels(payload: unknown): HomeStudyLevel[] {
  const p = payload as any;
  const raw =
    p?.data?.HomeStudyLevels ??
    p?.data?.homeStudyLevels ??
    p?.data?.studyLevels;
  if (!Array.isArray(raw)) return [];
  return raw
    .map(mapHomeStudyLevel)
    .filter((item: HomeStudyLevel | null): item is HomeStudyLevel => item !== null)
    .sort((a: HomeStudyLevel, b: HomeStudyLevel) => {
      if (a.orderIndex !== b.orderIndex) return a.orderIndex - b.orderIndex;
      return a.id - b.id;
    });
}

export const studentHomeApi = createApi({
  reducerPath: "studentHomeApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "StudentHome",
    "HomeStatistics",
    "HomeFeatures",
    "HomeGoals",
    "HomeMethodologies",
    "HomeStudyLevels",
    "EnrollmentStatus",
  ],
  endpoints: (builder) => ({
    /** GET `/home-study-levels` → homepage study system timeline. */
    getHomeStudyLevels: builder.query<HomeStudyLevel[], { lang: string }>({
      query: ({ lang }) => ({
        url: "/home-study-levels",
        method: "GET",
        headers: {
          "Accept-Language": resolveAcceptLanguage(lang),
        },
      }),
      transformResponse: (response: unknown): HomeStudyLevel[] => {
        return extractHomeStudyLevels(response);
      },
      providesTags: ["HomeStudyLevels"],
    }),

    /** GET `/home-methodologies` → homepage study methodology list. */
    getHomeMethodologies: builder.query<HomeMethodology[], { lang: string }>({
      query: ({ lang }) => ({
        url: "/home-methodologies",
        method: "GET",
        headers: {
          "Accept-Language": resolveAcceptLanguage(lang),
        },
      }),
      transformResponse: (response: unknown): HomeMethodology[] => {
        return extractHomeMethodologies(response);
      },
      providesTags: ["HomeMethodologies"],
    }),

    /** GET `/home-goals` → homepage goal cards. */
    getHomeGoals: builder.query<HomeGoal[], { lang: string }>({
      query: ({ lang }) => ({
        url: "/home-goals",
        method: "GET",
        headers: {
          "Accept-Language": resolveAcceptLanguage(lang),
        },
      }),
      transformResponse: (response: unknown): HomeGoal[] => {
        return extractHomeGoals(response);
      },
      providesTags: ["HomeGoals"],
    }),

    /** GET `/home-features` → homepage feature cards. */
    getHomeFeatures: builder.query<HomeFeature[], { lang: string }>({
      query: ({ lang }) => ({
        url: "/home-features",
        method: "GET",
        headers: {
          "Accept-Language": resolveAcceptLanguage(lang),
        },
      }),
      transformResponse: (response: unknown): HomeFeature[] => {
        return extractHomeFeatures(response);
      },
      providesTags: ["HomeFeatures"],
    }),

    /** GET `/statistics` → homepage counters. */
    getHomeStatistics: builder.query<HomeStatistic[], { lang: string }>({
      query: ({ lang }) => ({
        url: "/statistics",
        method: "GET",
        headers: {
          "Accept-Language": resolveAcceptLanguage(lang),
        },
      }),
      transformResponse: (response: unknown): HomeStatistic[] => {
        return extractStatistics(response);
      },
      providesTags: ["HomeStatistics"],
    }),

    /** GET `/enrollment-status` → homepage batch badge. */
    getEnrollmentStatus: builder.query<EnrollmentStatus, { lang: string }>({
      query: ({ lang }) => ({
        url: "/enrollment-status",
        method: "GET",
        headers: {
          "Accept-Language": resolveAcceptLanguage(lang),
        },
      }),
      transformResponse: (response: unknown): EnrollmentStatus => {
        return extractEnrollmentStatus(response);
      },
      providesTags: ["EnrollmentStatus"],
    }),

    // ---------------- ENROLL IN PROGRAM ----------------
    enrollInProgram: builder.mutation<unknown, { lang: string }>({
      query: ({ lang }) => ({
        url: "/enroll-in-program",
        method: "POST",
        data: new FormData(),
        auth: true,
        withCsrf: true,
        headers: {
          "Accept-Language": resolveAcceptLanguage(lang),
        },
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          persistUserFromProgramResponse(data);
        } catch {
          /* handled in component */
        }
      },
    }),
  }),
});

export const {
  useGetHomeStudyLevelsQuery,
  useGetHomeMethodologiesQuery,
  useGetHomeGoalsQuery,
  useGetHomeFeaturesQuery,
  useGetHomeStatisticsQuery,
  useGetEnrollmentStatusQuery,
  useEnrollInProgramMutation,
} = studentHomeApi;
