import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {
    CreateEmpleadoRequestBody,
    EmpleadoDto,
    GetDefaultsResponseDto,
    LoginRequestBody,
    PaginatedList
} from "@/features/api/types";

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://localhost:5001/api',
    credentials: 'include',
});

export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQuery,
    tagTypes: ['Empleados', 'Defaults'],
    endpoints: (builder) => ({
        login: builder.mutation<void, LoginRequestBody>({
            query: (credentials) => ({
                url: '/Users/login?useCookies=true&useSessionCookies=true',
                method: 'POST',
                body: credentials,
            }),
        }),
        getUserRoles: builder.query<string[], void>({
            query: () => "/Identities/GetUserRoles"
        }),
        getEmpleados: builder.query<PaginatedList<EmpleadoDto>, void>({
            query: () => "/Empleados?pageNumber=1&pageSize=10",
            providesTags: ['Empleados']
        }),
        getDefaults: builder.query<GetDefaultsResponseDto, void>({
            query: () => '/Defaults',
            providesTags: ['Defaults']
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
    useGetUserRolesQuery,
    useGetEmpleadosQuery,
    useCreateEmpleadosMutation,
    useGetDefaultsQuery
} = api;
