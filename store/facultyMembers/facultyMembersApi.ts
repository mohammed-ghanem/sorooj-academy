/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { axiosBaseQuery } from "@/store/base/axiosBaseQuery";

function resolveAcceptLanguage(lang?: string): string {
    const fromArg =
        typeof lang === "string" && lang.trim() !== "" ? lang.trim() : "";
    return fromArg || Cookies.get("lang") || "ar";
}

export type DoctorUser = {
    id: number;
    name?: string;
    email?: string;
    mobile?: string;
    avatar?: string;
    is_verified?: boolean;
    type?: string;
    is_active?: number | boolean;
    position?: string;
    about_doctor?: string;
    specialization?: string;
    created_at?: string;
};

/** Normalized row for `FacultyMembers` UI */
export type FacultyMemberCard = {
    id: number;
    imageSrc: string;
    name: string;
    department: string;
    title: string;
    description: string;
};

const FALLBACK_AVATAR = "/assets/images/dd.png";

function asNonEmptyString(v: unknown): string {
    return typeof v === "string" ? v.trim() : "";
}

function mapDoctorToCard(user: DoctorUser): FacultyMemberCard {
    const avatar = asNonEmptyString(user.avatar);
    return {
        id: user.id,
        imageSrc: avatar || FALLBACK_AVATAR,
        name: asNonEmptyString(user.name) || "—",
        department: asNonEmptyString(user.specialization) || "—",
        title: asNonEmptyString(user.position) || "—",
        description: asNonEmptyString(user.about_doctor) || "",
    };
}

function extractDoctorsPayload(payload: unknown): DoctorUser[] {
    const p = payload as any;
    const raw = p?.data?.Doctors ?? p?.data?.doctors;
    if (!Array.isArray(raw)) return [];
    const users: DoctorUser[] = [];
    for (const item of raw) {
        const u = item?.user;
        if (u && typeof u === "object" && typeof u.id === "number") {
            users.push(u as DoctorUser);
        }
    }
    return users;
}

export const facultyMembersApi = createApi({
    reducerPath: "facultyMembersApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["FacultyMembers"],
    endpoints: (builder) => ({
        getDoctors: builder.query<FacultyMemberCard[], { lang: string }>({
            query: ({ lang }) => ({
                url: "/doctors",
                method: "GET",
                headers: {
                    "Accept-Language": resolveAcceptLanguage(lang),
                },
            }),
            transformResponse: (response: unknown): FacultyMemberCard[] => {
                const doctors = extractDoctorsPayload(response);
                return doctors.map(mapDoctorToCard);
            },
            providesTags: ["FacultyMembers"],
        }),
    }),
});

export const { useGetDoctorsQuery } = facultyMembersApi;
 