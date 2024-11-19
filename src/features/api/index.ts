import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {
    AgresionGeoLocationDto,
    CreateAgresionCommand,
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
        getAgresionGeoLocation: builder.query<AgresionGeoLocationDto[], void>({
            query: () => '/Agresiones/GetAgresionesGeoLocation'
        }),
        createEmpleados: builder.mutation<void, CreateEmpleadoRequestBody>({
            query: (body) => ({
                url: '/Empleados',
                method: 'POST',
                body: body,
                invalidatesTags: ['Empleados']
            })
        }),
        createAgresion: builder.mutation<void, CreateAgresionCommand>({
            query: (body) => ({
                url: "/Agresiones",
                method: 'POST',
                body: body,
            })
        }),
    }),
});

export const {
    useLoginMutation,
    useGetUserRolesQuery,
    useGetEmpleadosQuery,
    useCreateEmpleadosMutation,
    useGetDefaultsQuery,
    useCreateAgresionMutation,
    useGetAgresionGeoLocationQuery
} = api;
