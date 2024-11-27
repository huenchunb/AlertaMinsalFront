import {useGetUserRolesQuery} from "@/features/api";

export const useGetUserRoleHook = () => {
    const {data: roles, isFetching: isFetchingRoles} = useGetUserRolesQuery(undefined, {
        refetchOnMountOrArgChange: true
    });
    return {
        roles,
        isFetchingRoles
    }
};

export default useGetUserRoleHook;