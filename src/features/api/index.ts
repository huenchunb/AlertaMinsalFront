import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BaseType, LoginRequestBody} from "@/features/api/types";

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
        getRoles: builder.query<BaseType[], void>({
            query: () => '/Identities/GetRoles',
        })
    }),
});

export const {useLoginMutation, useGetRolesQuery} = api;
