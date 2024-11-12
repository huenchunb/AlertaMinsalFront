import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BaseType, CreateEmpleadoRequestBody, EmpleadoDto, LoginRequestBody, PaginatedList} from "@/features/api/types";

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://localhost:5001/api',
    credentials: 'include',
});

export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQuery,
    tagTypes: ['Empleados'],
    endpoints: (builder) => ({
        login: builder.mutation<void, LoginRequestBody>({
            query: (credentials) => ({
                url: '/Users/login?useCookies=true&useSessionCookies=true',
                method: 'POST',
                body: credentials,
            }),
        }),
        getRoles: builder.query<BaseType[], void>({
            query: () => '/Identities/GetAllRoles',
        }),
        getUserRoles: builder.query<string[], void>({
            query: () => "/Identities/GetUserRoles"
        }),
        getEmpleados: builder.query<PaginatedList<EmpleadoDto>, void>({
            query: () => "/Empleados?pageNumber=1&pageSize=10",
            providesTags: ['Empleados']
        }),
        createEmpleados: builder.mutation<void, CreateEmpleadoRequestBody>({
            query: (body) => ({
                url: '/Empleados',
                method: 'POST',
                body: body,
                invalidatesTags: ['Empleados']
            })
        })
    }),
});

export const {
    useLoginMutation,
    useGetRolesQuery,
    useGetUserRolesQuery,
    useGetEmpleadosQuery,
    useCreateEmpleadosMutation
} = api;
