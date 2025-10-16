import axios from "axios";
import type { AdminUser } from "../interfaces/AdminUser";

export const adminApi = axios.create({
    baseURL: "http://localhost:8080/api/admin",
    headers: {
        Accept: "application/json"
    }
})

export const getUsers = async (): Promise<AdminUser[]> => {
    const response = await adminApi.get<AdminUser[]>("/get-users", {
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    })

    return response.data
}