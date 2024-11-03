import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {InfoResponseBody, LoginRequestBody} from "@/features/api/types";

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://localhost:5001/api',
    credentials: 'include',
});


export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        login: builder.mutation<void, LoginRequestBody>({
            query: (credentials) => ({
                url: '/Users/login?useCookies=true&useSessionCookies=true',
                method: 'POST',
                body: credentials,
            }),
        }),
        getUser: builder.query<InfoResponseBody, void>({
            query: () => '/Users/manage/info',
        }),
    }),
});

export const {useLoginMutation, useGetUserQuery} = api;
