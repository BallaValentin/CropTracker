import { useQuery } from "@tanstack/react-query"
import { getUsers } from "../services/AdminService"
import { useNavigate } from "react-router-dom"
import type { AxiosError } from "axios";
import type { AdminUser } from "../interfaces/AdminUser";

export const useAdminUsers = () => {
    const navigate = useNavigate();

    const query = useQuery<AdminUser[], AxiosError>({
        queryKey: ["adminUsers"],
        queryFn: getUsers,
        staleTime: 1000 * 60 * 60,
        refetchInterval: 1000 * 60 * 60,
    })

    if (query.isError && query.error) {
        const statusCode = query.error.response?.status ?? 500;
        const statusText = query.error.response?.statusText ?? 'Internal Server Error';

        navigate('/error', {state: {
                statusCode,
                statusText,
                errorMessage: 'Failed to fetch users. Make sure you are logged in as admin, and try again later.'
            }})
    }

    return query;
}