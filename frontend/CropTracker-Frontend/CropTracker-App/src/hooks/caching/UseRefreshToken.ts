import { useQuery } from "@tanstack/react-query"
import { refreshToken } from "../../services/AuthService"

export const useRefreshToken = () => {
    return useQuery({
        queryKey: ["authSession"],
        queryFn: refreshToken,
        retry: false,
        staleTime: Infinity
    })
}