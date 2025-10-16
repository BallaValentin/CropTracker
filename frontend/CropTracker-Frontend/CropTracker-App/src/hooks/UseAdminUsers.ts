import { useQuery } from "@tanstack/react-query"
import { getUsers } from "../services/AdminService"

export const useAdminUsers = () => {
    return useQuery({
        queryKey: ["adminUsers"],
        queryFn: getUsers,
        staleTime: 1000 * 60 * 60,
        refetchInterval: 1000 * 60 * 60,
    })
}