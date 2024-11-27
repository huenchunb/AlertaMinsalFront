import {useGetUserByEmailQuery} from "@/features/api";

interface Props {
    email: string | undefined
}

const useGetEmpleadoHook = ({email}: Props) => {
    const {
        data: user,
        error: errorUser,
        isFetching: isFetchingUser
    } = useGetUserByEmailQuery(email ?? "", {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
        refetchOnFocus: true,
    });

    return {
        user,
        errorUser,
        isFetchingUser
    }
};

export default useGetEmpleadoHook;