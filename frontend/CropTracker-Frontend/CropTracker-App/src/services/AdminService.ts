import axios from "axios";
import type { AdminUser } from "../interfaces/AdminUser";

export const adminApi = axios.create({
    baseURL: "http://localhost:8080/api/admin",
    headers: {
        Accept: "application/json"
    }
})

export const getUsers = async (): Promise<AdminUser[]> => {
    console.log("Sending get-users request to server")
    const response = await adminApi.get<AdminUser[]>("/get-users", {
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    })

    return response.data
}

export const getAvatar = async(userID: string): Promise<Blob> => {
    console.log('Sending get avatar request to server');
    const response = await adminApi.get<Blob>(`/get-user-avatar?${userID}`, {
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        },
        responseType: 'blob'
    })

    return response.data
}