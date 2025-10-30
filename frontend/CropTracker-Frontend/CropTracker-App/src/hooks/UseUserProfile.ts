import { useQuery } from "@tanstack/react-query"
import { fetchUserData } from "../services/UserService"
import type { AxiosError } from "axios";
import type { UserData } from "../interfaces/UserData";
import { useNavigate } from "react-router-dom";
import { getStatusMessage } from "../utils/GetStatusMessage";

export const useUserProfile = () => {
    const navigate = useNavigate();
    const query = useQuery<UserData, AxiosError>({
        queryKey: ["userProfile"],
        queryFn: fetchUserData,
        staleTime: 1000 * 60 * 60,
        refetchInterval: 1000 * 60 * 60,
    })

    if (query.isError && query.error) {
            const statusCode = query.error.response?.status ?? 500;
            const statusText = getStatusMessage(statusCode);
    
            navigate('/error', {state: {
                    statusCode,
                    statusText,
                    errorMessage: 'Failed to fetch user data. Make sure you are logged in, and try again later.'
                }})
        }

    return query;
}