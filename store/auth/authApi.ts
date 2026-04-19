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

/** Laravel-style auth payloads: token may live on `data.user.access_token` or flat `data.access_token`. */
const getAccessTokenFromResponse = (payload: unknown): string | undefined => {
    const d = payload as {
        data?: {
            user?: { access_token?: string; user?: unknown };
            access_token?: string;
        };
        access_token?: string;
    };
    return (
        d?.data?.user?.access_token ??
        d?.data?.access_token ??
        d?.access_token
    );
};

const authCookieOptions = {
    expires: 7,
    secure: process.env.NODE_ENV === "production",
    path: "/",
} as const;

const persistUserProfileCookie = (payload: unknown) => {
    const d = payload as { data?: { user?: { user?: unknown } } };
    const profile = d?.data?.user?.user;
    if (profile && typeof profile === "object") {
        try {
            Cookies.set("user", JSON.stringify(profile), authCookieOptions);
        } catch {
            /* ignore JSON / storage errors */
        }
    }
};

/**
 * When true, the API returned a token but the account must complete email/OTP
 * verification before opening a normal session (`access_token`).
 * Unknown / missing fields default to verified so older API shapes keep working.
 */
export const needsOtpVerificationBeforeSession = (
    payload: unknown,
): boolean => {
    const p = payload as {
        requires_verification?: boolean;
        must_verify_email?: boolean;
        data?: {
            requires_verification?: boolean;
            must_verify_email?: boolean;
            is_verified?: boolean | number | string;
        };
    };
    if (p?.requires_verification === true || p?.must_verify_email === true) {
        return true;
    }
    if (
        p?.data?.requires_verification === true ||
        p?.data?.must_verify_email === true
    ) {
        return true;
    }

    // Login API shape: data: { is_verified: false, access_token, ... }
    if (
        p?.data &&
        typeof p.data === "object" &&
        "is_verified" in p.data
    ) {
        const v = p.data.is_verified;
        return v !== true && v !== 1 && v !== "1";
    }

    const d = payload as { data?: { user?: { user?: Record<string, unknown> } } };
    const u = d?.data?.user?.user;
    if (!u || typeof u !== "object") return false;

    if ("email_verified_at" in u) {
        const v = u.email_verified_at;
        return v == null || String(v).trim() === "";
    }
    if ("is_verified" in u) return !Boolean(u.is_verified);
    if ("isVerified" in u) return !Boolean(u.isVerified);
    if ("verified" in u) return !Boolean(u.verified);
    if ("email_verified" in u) return !Boolean(u.email_verified);

    return false;
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
                    query: (arg: { page?: number; limit?: number }) => ({
                        url: "/countries",
                        method: "GET",
                        params: {
                            page: arg.page ?? 0,
                            limit: arg.limit ?? 0,
                        },
                        headers: {
                            "Accept-Language": Cookies.get("lang") || "ar",
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
                    const token = getAccessTokenFromResponse(data);
                    if (token) {
                       
                        Cookies.set("reset_token", token, {
                            expires: 1,
                            secure: process.env.NODE_ENV === "production",
                            path: "/",
                        });
                    }
                    persistUserProfileCookie(data);
                } catch {
                    /* handled in component */
                }
            },
        }),

        // ---------------- LOGIN (form-data: email, password, lang) ----------------
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
                    const token = getAccessTokenFromResponse(data);
                    if (token && needsOtpVerificationBeforeSession(data)) {
                        Cookies.remove("access_token", { path: "/" });
                        Cookies.remove("user", { path: "/" });
                        Cookies.remove("auth_otp_flow", { path: "/" });
                        Cookies.set("reset_token", token, {
                            expires: 1,
                            secure: process.env.NODE_ENV === "production",
                            path: "/",
                        });
                        persistUserProfileCookie(data);
                        return;
                    }
                    if (token) {
                        Cookies.set("access_token", token, authCookieOptions);
                    }
                    persistUserProfileCookie(data);
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
                    const token = getAccessTokenFromResponse(data);
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
                    const isPasswordResetFlow =
                        Cookies.get("auth_otp_flow") === "password_reset";

                    if (isPasswordResetFlow) {
                        // Forgot password: keep token for POST /reset-password, do not open a session.
                        Cookies.remove("access_token", { path: "/" });
                        Cookies.remove("user", { path: "/" });
                        const token = getAccessTokenFromResponse(data);
                        if (token) {
                            Cookies.set("reset_token", token, {
                                expires: 1,
                                secure: process.env.NODE_ENV === "production",
                                path: "/",
                            });
                        }
                    } else {
                        // Registration email verification: establish session.
                        const token = getAccessTokenFromResponse(data);
                        if (token) {
                            Cookies.set("access_token", token, authCookieOptions);
                        }
                        persistUserProfileCookie(data);
                        Cookies.remove("reset_token", { path: "/" });
                    }
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

        // ---------------- RESET PASSWORD (form-data: password, password_confirmation + Bearer reset_token) ----------------
        resetPassword: builder.mutation<
            any,
            { password: string; password_confirmation: string }
        >({
            query: ({ password, password_confirmation }) => {
                const token = Cookies.get("reset_token");
                const formData = new FormData();
                formData.append("password", password);
                formData.append("password_confirmation", password_confirmation);
                return {
                    url: "/auth/reset-password",
                    method: "POST",
                    data: formData,
                    headers: token
                        ? { Authorization: `Bearer ${token}` }
                        : undefined,
                    withCsrf: true,
                };
            },
            invalidatesTags: ["Profile"],
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    Cookies.remove("reset_token", { path: "/" });
                    Cookies.remove("reset_email", { path: "/" });
                    Cookies.remove("auth_otp_flow", { path: "/" });
                    Cookies.remove("access_token", { path: "/" });
                    Cookies.remove("user", { path: "/" });
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
                    const newToken = getAccessTokenFromResponse(data);
                    if (newToken) {
                        Cookies.set("access_token", newToken, authCookieOptions);
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







