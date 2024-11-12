"use client";

import {useGetEmpleadosQuery} from "@/features/api";

export const useGetEmpleadosHook = () => {
    const {data, isLoading} = useGetEmpleadosQuery(undefined, {
        refetchOnMountOrArgChange: true
    });

    return {
        data,
        isLoading
    };
};