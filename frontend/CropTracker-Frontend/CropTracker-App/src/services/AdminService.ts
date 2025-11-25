import axios from "axios";
import type { AdminUser } from "../interfaces/response/AdminUser";
import type { UserStatusUpdate } from "../interfaces/request/UserStatusUpdate";
import type { UserRoleUpdates } from "../interfaces/request/UserRoleUpdates";

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

export const updateStatus = async(userStatusUpdate: UserStatusUpdate): Promise<void> => {
    console.log("Sending user update status request to server");
    await adminApi.put('/set-status', userStatusUpdate, {headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        }})
}

export const updateRoles = async(userRoleUpdates: UserRoleUpdates): Promise<void> => {
    console.log("Sending user update roles request to server");
    await adminApi.put('/set-roles', userRoleUpdates, {headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        }})
}