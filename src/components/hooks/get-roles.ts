import {
    useGetAggressionsSummaryQuery,
    useGetAggressionSummaryByDateQuery,
    useGetAgresionesCountByCategoriesQuery,
    useGetAgresionGeoLocationQuery,
} from "@/features/api";

export const useDashboardHook = () => {

    const {data: dataGeoLocation, isLoading: isLoadingGeoLocation} =
        useGetAgresionGeoLocationQuery(undefined, {
            refetchOnMountOrArgChange: true,
            refetchOnReconnect: true,
            refetchOnFocus: true,
        });

    const {data: dataByCategories} = useGetAgresionesCountByCategoriesQuery(
        undefined,
        {
            refetchOnMountOrArgChange: true,
            refetchOnReconnect: true,
            refetchOnFocus: true,
        }
    );

    const {data: dataByDate} = useGetAggressionSummaryByDateQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
        refetchOnFocus: true,
    });

    const {data: dataAggressionSummary} = useGetAggressionsSummaryQuery(
        undefined,
        {
            refetchOnMountOrArgChange: true,
            refetchOnReconnect: true,
            refetchOnFocus: true,
        }
    );

    return {
        dataGeoLocation,
        isLoadingGeoLocation,
        dataByCategories,
        dataByDate,
        dataAggressionSummary
    };
};
