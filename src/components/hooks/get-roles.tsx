import {
  useGetAggressionsSummaryQuery,
  useGetAggressionSummaryByDateQuery,
  useGetAgresionesCountByCategoriesQuery,
  useGetAgresionGeoLocationQuery,
  useGetUserRolesQuery,
} from "@/features/api";
import { useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";
import { setRol } from "@/features/auth/slice";

export const useDashboardHook = () => {
  const { data } = useGetUserRolesQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

  const { data: dataGeoLocation, isLoading: isLoadingGeoLocation } =
    useGetAgresionGeoLocationQuery(undefined, {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
    });

  const { data: dataByCategories } = useGetAgresionesCountByCategoriesQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }
  );

  const { data: dataByDate } = useGetAggressionSummaryByDateQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

  const { data: dataAggressionSummary } = useGetAggressionsSummaryQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }
  );


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
    dataByDate,
    dataAggressionSummary,
  };
};
