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
  const phonesRaw = raw.phones;

  return {
    x: asContactUrl(raw.x),
    email: asContactUrl(raw.email),
    phones: Array.isArray(phonesRaw)
      ? phonesRaw.filter((item): item is string => typeof item === "string")
      : [],
    tiktok: asContactUrl(raw.tiktok),
    facebook: asContactUrl(raw.facebook),
    snapchat: asContactUrl(raw.snapchat),
    whatsapp: asContactUrl(raw.whatsapp),
    instagram: asContactUrl(raw.instagram),
    telegram: asContactUrl(raw.telegram),
    youtube: asContactUrl(raw.youtube),
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
