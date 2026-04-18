import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/store/base/axiosBaseQuery";

export type StaticPageHtml = { html: string };

export const staticPagesApi = createApi({
    reducerPath: "staticPagesApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: [
        "StaticPrivacyPolicy",
        "StaticTermsAndConditions",
        "StaticDeleteAccount",
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
    }),
});

export const {
    useGetStaticPrivacyPolicyQuery,
    useGetStaticTermsAndConditionsQuery,
    useGetStaticDeleteAccountQuery,
} = staticPagesApi;
