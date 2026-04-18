/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/store/base/axiosBaseQuery";

export const contactApi = createApi({
    reducerPath: "contactApi",
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        submitContact: builder.mutation<any, FormData>({
            query: (body) => ({
                url: "/contacts",
                method: "POST",
                data: body,
                withCsrf: true,
            }),
        }),
    }),
});

export const { useSubmitContactMutation } = contactApi;
