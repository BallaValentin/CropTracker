import { useQuery } from "@tanstack/react-query"
import { fetchUserData } from "../services/UserService"
import type { AxiosError } from "axios";
import type { GetUserDTO } from "../interfaces/response/GetUserDTO";

export const useUserProfile = () => {
    return useQuery<GetUserDTO, AxiosError>({
        queryKey: ["userProfile"],
        queryFn: fetchUserData,
        staleTime: 1000 * 60 * 60,
        refetchInterval: 1000 * 60 * 60,
        retry: false
    })
}