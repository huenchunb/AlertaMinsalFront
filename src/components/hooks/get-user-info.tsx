import {useGetUserInfoQuery} from "@/features/api";

const useGetUserInfo = () => {

    const {data: userInfo, isFetching: isFetchingUserInfo} = useGetUserInfoQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
        refetchOnFocus: true,

    });
    return {
        userInfo,
        isFetchingUserInfo
    }
};

export default useGetUserInfo;