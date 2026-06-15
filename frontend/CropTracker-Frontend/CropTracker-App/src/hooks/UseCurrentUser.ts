import { useQuery } from "@tanstack/react-query"
import type { CacheUserData } from "../interfaces/CacheUserData";
import { getUserData } from "../services/UserService";
import type { AxiosError } from "axios";

export const useCurrentProfile = (enabled?: boolean) => {
    return useQuery<CacheUserData, AxiosError>({
        queryKey: ["userProfile"],
        queryFn: getUserData,
        staleTime: 1000 * 60 * 60,
        refetchInterval: 1000 * 60 * 60,
        enabled: enabled,
    })
}