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

export const studentHomeApi = createApi({
  reducerPath: "studentHomeApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["StudentHome"],
  endpoints: (builder) => ({
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

export const { useEnrollInProgramMutation } = studentHomeApi;
