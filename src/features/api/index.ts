import {BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError,} from '@reduxjs/toolkit/query/react';

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
    LoginResponseBody,
    PaginatedList,
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

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 404) {
        const refreshToken = Cookies.get('refreshToken');
        if (refreshToken) {
            const refreshResult = await baseQuery(
                {
                    url: '/Users/refresh',
                    method: 'POST',
                    body: {refreshToken},
                },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                const data = refreshResult.data as LoginResponseBody;

                Cookies.set('accessToken', data.accessToken, {expires: 1, path: '/'});
                Cookies.set('refreshToken', data.refreshToken, {
                    expires: 1,
                    path: '/',
                });

                const newHeaders = new Headers();
                newHeaders.set('Authorization', `Bearer ${data.accessToken}`);

                const retryArgs = prepareRetryArgs(args, newHeaders);

                result = await baseQuery(retryArgs, api, extraOptions);
            } else {

                Cookies.remove('accessToken', {path: '/'});
                Cookies.remove('refreshToken', {path: '/'});
                window.location.href = '/login';
            }
        } else {
            Cookies.remove('accessToken', {path: '/'});
            window.location.href = '/login';
        }
    }

    return result;
};


const prepareRetryArgs = (
    args: string | FetchArgs,
    headers: Headers
): FetchArgs => {
    if (typeof args === 'string') {
        return {url: args, headers};
    } else {
        return {...args, headers};
    }
};


export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
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
