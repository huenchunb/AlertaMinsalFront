import {useGetRolesQuery} from "@/features/api";
import {useAppDispatch} from "@/store/hooks";
import {useEffect} from "react";
import {setRol} from "@/features/auth/slice";

export const useGetRolesHook = () => {
    const {data, isLoading} = useGetRolesQuery();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (data) {
            dispatch(setRol(data[0]))
        }
    }, [data, dispatch]);

    return {
        isLoading,
    }
}