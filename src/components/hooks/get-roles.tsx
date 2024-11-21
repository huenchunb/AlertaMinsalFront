import {
    useGetAggressionSummaryByDateQuery,
    useGetAgresionesCountByCategoriesQuery,
    useGetAgresionGeoLocationQuery,
    useGetUserRolesQuery
} from "@/features/api";
import {useAppDispatch} from "@/store/hooks";
import {useEffect} from "react";
import {setRol} from "@/features/auth/slice";

export const useDashboardHook = () => {
    const {data} = useGetUserRolesQuery();
    const {data: dataGeoLocation, isLoading: isLoadingGeoLocation} = useGetAgresionGeoLocationQuery();
    const {data: dataByCategories} = useGetAgresionesCountByCategoriesQuery();
    const {data: dataByDate} = useGetAggressionSummaryByDateQuery();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (data) {
            dispatch(setRol(data));
        }
    }, [data, dispatch]);

    return {
        dataGeoLocation,
        isLoadingGeoLocation,
        dataByCategories,
        dataByDate
    };
};