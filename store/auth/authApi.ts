/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { axiosBaseQuery } from "@/store/base/axiosBaseQuery";

export type Country = {
    id: number;
    name: string;
    is_active?: boolean;
    created_at?: string;
};

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["Profile"],
    endpoints: (builder) => ({
        // ---------------- COUNTRIES (registration) ----------------
        getCountries: builder.query<
            Country[],
            { page?: number; limit?: number } | void
        >({
            query: (arg) => ({
                url: "/countries",
                method: "GET",
                params: {
                    page: arg?.page ?? 0,
                    limit: arg?.limit ?? 0,
                },
            }),
            transformResponse: (response: { data?: Country[] }) => {
                const list = response?.data;
                if (!Array.isArray(list)) return [];
                return list.filter((c) => c.is_active !== false);
            },
        }),

        // ---------------- REGISTER ----------------
        register: builder.mutation<any, FormData>({
            query: (body) => ({
                url: "/auth/register",
                method: "POST",
                data: body,
                withCsrf: true,
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    const { data }: any = await queryFulfilled;
                    const token =
                        data?.data?.access_token ?? data?.access_token;
                    if (token) {
                        Cookies.set("access_token", token, {
                            expires: 7,
                            secure: process.env.NODE_ENV === "production",
                            path: "/",
                        });
                        Cookies.set("reset_token", token, {
                            expires: 1,
                            secure: process.env.NODE_ENV === "production",
                            path: "/",
                        });
                    }
                } catch {
                    /* handled in component */
                }
            },
        }),

        // ---------------- LOGIN (form-data: email, password, device_token, lang) ----------------
        login: builder.mutation<any, FormData>({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                data: body,
                withCsrf: true,
            }),
            invalidatesTags: ["Profile"],
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    const { data }: any = await queryFulfilled;
                    const token =
                        data?.data?.access_token ?? data?.access_token;
                    if (token) {
                        Cookies.set("access_token", token, {
                            expires: 7,
                            secure: process.env.NODE_ENV === "production",
                            path: "/",
                        });
                    }
                } catch {
                    /* handled in component */
                }
            },
        }),

        // ---------------- LOGOUT ----------------
        logout: builder.mutation<any, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
                auth: true,
                withCsrf: true,
            }),
            invalidatesTags: ["Profile"],
        }),

        // ---------------- FORGET PASSWORD (form-data: email) ----------------
        sendResetCode: builder.mutation<any, FormData>({
            query: (body) => ({
                url: "/auth/forget-password",
                method: "POST",
                data: body,
                withCsrf: true,
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    const { data }: any = await queryFulfilled;
                    const token =
                        data?.data?.access_token ?? data?.access_token;
                    if (token) {
                        Cookies.set("reset_token", token, {
                            expires: 1,
                            secure: process.env.NODE_ENV === "production",
                            path: "/",
                        });
                    }
                } catch {
                    /* handled in component */
                }
            },
        }),

        // ---------------- VERIFY OTP (form-data: code) — uses Bearer reset_token ----------------
        verifyCode: builder.mutation<any, FormData>({
            query: (body) => ({
                url: "/auth/verify-otp",
                method: "POST",
                data: body,
                withCsrf: true,
            }),
            invalidatesTags: ["Profile"],
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    const { data }: any = await queryFulfilled;
                    const token =
                        data?.data?.access_token ?? data?.access_token;
                    if (token) {
                        Cookies.set("access_token", token, {
                            expires: 7,
                            secure: process.env.NODE_ENV === "production",
                            path: "/",
                        });
                    }
                    Cookies.remove("reset_token", { path: "/" });
                } catch {
                    /* handled in component */
                }
            },
        }),

        // ---------------- RESEND OTP (POST, no body — session via Bearer reset_token) ----------------
        resendOtp: builder.mutation<any, void>({
            query: () => ({
                url: "/auth/resend-otp",
                method: "POST",
                withCsrf: true,
            }),
        }),

        // ---------------- RESET PASSWORD ----------------
        resetPassword: builder.mutation<
            any,
            {
                email: string;
                code: string;
                password: string;
                password_confirmation: string;
            }
        >({
            query: (body) => {
                const token = Cookies.get("reset_token");
                return {
                    url: "/auth/reset-password",
                    method: "POST",
                    data: body,
                    headers: token
                        ? { Authorization: `Bearer ${token}` }
                        : undefined,
                    withCsrf: true,
                };
            },
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    Cookies.remove("reset_token");
                } catch (error) {
                    console.error("Reset password failed:", error);
                }
            },
        }),

        // ---------------- CHANGE PASSWORD ----------------
        changePassword: builder.mutation<
            any,
            {
                old_password: string;
                password: string;
                password_confirmation: string;
            }
        >({
            query: (body) => ({
                url: "/auth/change-password",
                method: "POST",
                data: body,
                auth: true,
                withCsrf: true,
            }),
            invalidatesTags: ["Profile"],
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    const { data }: any = await queryFulfilled;
                    const newToken = data?.data?.access_token || data?.access_token;
                    if (newToken) {
                        Cookies.set("access_token", newToken, {
                            expires: 7,
                            secure: process.env.NODE_ENV === "production",
                            path: "/",
                        });
                    }
                } catch (error) {
                    console.error("Password change failed:", error);
                }
            },
        }),

        // ---------------- GET PROFILE ----------------
        getProfile: builder.query<any, void>({
            query: () => ({
                url: "/auth/profile",
                method: "GET",
                auth: true,
            }),
            transformResponse: (response: any) => {
                if (response?.data) {
                    return response.data;
                }
                return response;
            },
            providesTags: ["Profile"],
        }),

        // ---------------- UPDATE PROFILE ----------------
        updateProfile: builder.mutation<any, FormData>({
            query: (body) => ({
                url: "/auth/update-profile",
                method: "POST",
                data: body,
                auth: true,
                withCsrf: true,
            }),
            invalidatesTags: ["Profile"],
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useSendResetCodeMutation,
    useVerifyCodeMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useResendOtpMutation,
    useGetCountriesQuery,
    useRegisterMutation,
} = authApi;
