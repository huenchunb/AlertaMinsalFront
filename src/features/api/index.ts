import {createApi, fetchBaseQuery,} from '@reduxjs/toolkit/query/react';

import {
    AggressionDto,
    AgresionesCountByCategories,
    AgresionGeoLocationDto,
    ApproveAggressionCommand,
    CreateAgresionCommand,
    CreateEmpleadoRequestBody,
    CreateEstablishmentCommand,
    EmpleadoDto,
    EstablecimientoDto,
    GetAggresionsSummaryResponseDto,
    GetAggressionsQuery,
    GetAggressionSummaryByDate,
    GetDefaultsResponseDto,
    GetEmpleadoQuery,
    LoginRequestBody,
    LoginResponseBody,
    PaginatedList,
    UserInfoResponse,
} from "@/features/api/types";
import Cookies from "js-cookie";

const baseQuery = fetchBaseQuery({
    //baseUrl: "https://alertaminsal.azurewebsites.net/api",
    baseUrl: "https://localhost:5001/api",
    prepareHeaders: (headers) => {
        const token = Cookies.get('accessToken');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQuery,
    tagTypes: ["Empleados", "Defaults", "Establecimientos", "Aggressions"],
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponseBody, LoginRequestBody>({
            query: (credentials) => ({
                url: "/Users/login",
                method: "POST",
                body: credentials,
            }),
        }),
        getUserRoles: builder.query<string[], void>({
            query: () => "/Identities/GetUserRoles",
        }),
        getUserInfo: builder.query<UserInfoResponse, void>({
            query: () => "/Users/manage/info",
        }),
        getUserByEmail: builder.query<EmpleadoDto, string>({
            query: (email) => `/Empleados/email/${email}`,
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
        getEstablecimientoById: builder.query<EstablecimientoDto, number>({
            query: (id: number) => `/Establecimientos/${id}`
        }),
        getEmpleados: builder.query<
            PaginatedList<EmpleadoDto>,
            GetEmpleadoQuery
        >({
            query: ({pageNumber, pageSize, establecimientoId}) =>
                `/Empleados?pageNumber=${pageNumber}&pageSize=${pageSize}${establecimientoId ? `&establecimientoId=${establecimientoId}` : ``}`,
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
            GetAggressionsQuery
        >({
            query: ({pageNumber, pageSize, establecimientoId, empleadoId}) =>
                `/Agresiones?pageNumber=${pageNumber}&pageSize=${pageSize}${establecimientoId ? `&establecimientoId=${establecimientoId}` : ``}${empleadoId ? `&empleadoId=${empleadoId}` : ``}`,
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
        createEstablecimiento: builder.mutation<void, CreateEstablishmentCommand>({
            query: (body) => ({
                url: "/Establecimientos",
                method: "POST",
                body: body,
                invalidatesTags: ["Establecimientos"],
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
    useGetUserInfoQuery,
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
    useCreateEstablecimientoMutation,
    useGetUserByEmailQuery
} = api;
