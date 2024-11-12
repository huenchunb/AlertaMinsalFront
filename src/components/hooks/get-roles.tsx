import {useGetUserRolesQuery} from "@/features/api";
import {useAppDispatch} from "@/store/hooks";
import {useEffect} from "react";
import {setRol} from "@/features/auth/slice";

export const useGetUserRolesHook = () => {
    const {data, isLoading} = useGetUserRolesQuery();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (data) {
            dispatch(setRol(data));
        }
    }, [data, dispatch]);

    return {
        isLoading,
    };
};