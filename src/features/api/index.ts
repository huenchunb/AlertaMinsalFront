import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {
    AggressionDto,
    AgresionesCountByCategories,
    AgresionGeoLocationDto,
    ApproveAggressionCommand,
    CreateAgresionCommand,
    CreateEmpleadoRequestBody,
    EmpleadoDto,
    EstablecimientoDto,
    GetAggresionsSummaryResponseDto,
    GetAggressionSummaryByDate,
    GetDefaultsResponseDto,
    LoginRequestBody,
    PaginatedList,
} from "@/features/api/types";

const baseQuery = fetchBaseQuery({
    baseUrl: "https://alertaminsal.azurewebsites.net/api",
    credentials: "include",
});

export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQuery,
    tagTypes: ["Empleados", "Defaults", "Establecimientos", "Aggressions"],
    endpoints: (builder) => ({
        login: builder.mutation<void, LoginRequestBody>({
            query: (credentials) => ({
                url: "/Users/login?useCookies=true&useSessionCookies=true",
                method: "POST",
                body: credentials,
            }),
        }),
        getUserRoles: builder.query<string[], void>({
            query: () => "/Identities/GetUserRoles",
        }),
        getEstablecimientos: builder.query<
            PaginatedList<EstablecimientoDto>,
            {
                pageNumber: number;
                pageSize: number;
            }
        >({
            query: ({pageNumber, pageSize}) =>
                `/Establecimientos?pageNumber=${pageNumber}&pageSize=${pageSize}`,
            providesTags: ["Establecimientos"],
        }),
        getEmpleados: builder.query<
            PaginatedList<EmpleadoDto>,
            { pageNumber: number; pageSize: number }
        >({
            query: ({pageNumber, pageSize}) =>
                `/Empleados?pageNumber=${pageNumber}&pageSize=${pageSize}`,
            providesTags: ["Empleados"],
        }),
        getDefaults: builder.query<GetDefaultsResponseDto, void>({
            query: () => "/Defaults",
            providesTags: ["Defaults"],
        }),
        getAgresionGeoLocation: builder.query<AgresionGeoLocationDto[], void>({
            query: () => "/Agresiones/GetAgresionesGeoLocation",
        }),
        getAgresionesCountByCategories: builder.query<
            AgresionesCountByCategories[],
            void
        >({
            query: () => "/Agresiones/GetAgresionesCountByCategories",
        }),
        getAggressionSummaryByDate: builder.query<
            GetAggressionSummaryByDate[],
            void
        >({
            query: () => "/Agresiones/GetAggressionSummaryByDate",
        }),
        getAggressions: builder.query<
            PaginatedList<AggressionDto>,
            { pageNumber: number; pageSize: number }
        >({
            query: ({pageNumber, pageSize}) =>
                `/Agresiones?pageNumber=${pageNumber}&pageSize=${pageSize}`,
            providesTags: ["Aggressions"]
        }),
        GetAggressionsSummary: builder.query<GetAggresionsSummaryResponseDto, void>(
            {
                query: () => `/Agresiones/GetAggressionsSummary`,
            }
        ),
        createEmpleados: builder.mutation<void, CreateEmpleadoRequestBody>({
            query: (body) => ({
                url: "/Empleados",
                method: "POST",
                body: body,
                invalidatesTags: ["Empleados"],
            }),
        }),
        createAgresion: builder.mutation<void, CreateAgresionCommand>({
            query: (body) => ({
                url: "/Agresiones",
                method: "POST",
                body: body,
                invalidatesTags: ["Aggressions"],
            }),
        }),
        approveAggression: builder.mutation<void, ApproveAggressionCommand>({
            query: (body) => ({
                url: `/Agresiones/${body.id}`,
                method: "PUT",
                body: body,
                invalidatesTags: ["Aggressions"],
            }),
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
    useGetAgresionGeoLocationQuery,
    useGetEstablecimientosQuery,
    useGetAgresionesCountByCategoriesQuery,
    useGetAggressionSummaryByDateQuery,
    useGetAggressionsQuery,
    useGetAggressionsSummaryQuery,
    useApproveAggressionMutation,
} = api;
