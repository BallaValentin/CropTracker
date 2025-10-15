import { useQuery } from "@tanstack/react-query"
import { fetchUserData } from "../services/UserService"

export const useUserProfile = () => {
    return useQuery({
        queryKey: ["userProfile"],
        queryFn: fetchUserData,
        staleTime: 1000 * 60 * 60,
        refetchInterval: 1000 * 60 * 60,
    })
}