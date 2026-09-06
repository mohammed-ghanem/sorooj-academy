import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/store/base/axiosBaseQuery";

export type StaticPageHtml = { html: string };

export type AppContacts = {
  x: string;
  email: string;
  phones: string[];
  tiktok: string;
  facebook: string;
  snapchat: string;
  whatsapp: string;
  instagram: string;
  telegram: string;
  youtube: string;
};

function asContactUrl(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function mapAppContacts(payload: unknown): AppContacts {
  const r = payload as { data?: Record<string, unknown> };
  const raw = r?.data && typeof r.data === "object" ? r.data : {};
  const social =
    raw.social && typeof raw.social === "object"
      ? (raw.social as Record<string, unknown>)
      : {};
  const phonesRaw = raw.phones ?? raw.mobile;

  const readSocial = (key: string): string =>
    asContactUrl(social[key]) || asContactUrl(raw[key]);

  return {
    x: readSocial("x") || readSocial("twitter"),
    email: asContactUrl(raw.email),
    phones: Array.isArray(phonesRaw)
      ? phonesRaw.filter((item): item is string => typeof item === "string")
      : [],
    tiktok: readSocial("tiktok"),
    facebook: readSocial("facebook"),
    snapchat: readSocial("snapchat"),
    whatsapp: asContactUrl(raw.whatsapp),
    instagram: readSocial("instagram"),
    telegram: readSocial("telegram"),
    youtube: readSocial("youtube"),
  };
}

export const staticPagesApi = createApi({
    reducerPath: "staticPagesApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: [
        "StaticPrivacyPolicy",
        "StaticTermsAndConditions",
        "StaticDeleteAccount",
        "AppContacts",
    ],
    endpoints: (builder) => ({
        getStaticPrivacyPolicy: builder.query<
            StaticPageHtml,
            { lang: string }
        >({
            query: ({ lang }) => ({
                url: "/static-pages/privacy-policy",
                method: "GET",
                headers: {
                    "Accept-Language": lang,
                },
            }),
            transformResponse: (response: unknown): StaticPageHtml => {
                const r = response as { data?: unknown };
                const raw = r?.data;
                return {
                    html: typeof raw === "string" ? raw : "",
                };
            },
            providesTags: ["StaticPrivacyPolicy"],
        }),

        getStaticTermsAndConditions: builder.query<
            StaticPageHtml,
            { lang: string }
        >({
            query: ({ lang }) => ({
                url: "/static-pages/terms-and-conditions",
                method: "GET",
                headers: {
                    "Accept-Language": lang,
                },
            }),
            transformResponse: (response: unknown): StaticPageHtml => {
                const r = response as { data?: unknown };
                const raw = r?.data;
                return {
                    html: typeof raw === "string" ? raw : "",
                };
            },
            providesTags: ["StaticTermsAndConditions"],
        }),

        getStaticDeleteAccount: builder.query<
            StaticPageHtml,
            { lang: string }
        >({
            query: ({ lang }) => ({
                url: "/static-pages/delete-account",
                method: "GET",
                headers: {
                    "Accept-Language": lang,
                },
            }),
            transformResponse: (response: unknown): StaticPageHtml => {
                const r = response as { data?: unknown };
                const raw = r?.data;
                return {
                    html: typeof raw === "string" ? raw : "",
                };
            },
            providesTags: ["StaticDeleteAccount"],
        }),

        getAppContacts: builder.query<AppContacts, { lang: string }>({
            query: ({ lang }) => ({
                url: "/static-pages/app-contacts",
                method: "GET",
                headers: {
                    "Accept-Language": lang,
                },
            }),
            transformResponse: (response: unknown): AppContacts => {
                return mapAppContacts(response);
            },
            providesTags: ["AppContacts"],
        }),
    }),
});

export const {
    useGetStaticPrivacyPolicyQuery,
    useGetStaticTermsAndConditionsQuery,
    useGetStaticDeleteAccountQuery,
    useGetAppContactsQuery,
} = staticPagesApi;
