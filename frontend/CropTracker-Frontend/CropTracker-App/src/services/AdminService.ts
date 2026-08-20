import axios from "axios";
import type { GetAdminUserDTO } from "../interfaces/response/GetAdminUserDTO";
import type { UpdateUserRoleDTO } from "../interfaces/request/UpdateUserRoleDTO";
import type { UpdateUserStatusDTO } from "../interfaces/request/UpdateUserStatusDTO";
import { attachAuthInterceptors } from "./AttachAuthInterceptors";

export const adminApi = axios.create({
    baseURL: "http://localhost:8080/api/admin",
    withCredentials: true,
    headers: {
        Accept: "application/json"
    }
});

attachAuthInterceptors(adminApi);

export const getUsers = async (): Promise<GetAdminUserDTO[]> => {
    console.log("Sending get-users request to server")
    const response = await adminApi.get<GetAdminUserDTO[]>("/get-users");

    return response.data
};

export const getAvatar = async(userID: string): Promise<Blob> => {
    console.log('Sending get avatar request to server');
    const response = await adminApi.get<Blob>(`/get-user-avatar?${userID}`, {
        responseType: 'blob'
    })

    return response.data
};

export const updateStatus = async(userStatusUpdate: UpdateUserStatusDTO): Promise<void> => {
    console.log("Sending user update status request to server");
    await adminApi.put('/set-status', userStatusUpdate);
};

export const updateRoles = async(userRoleUpdates: UpdateUserRoleDTO): Promise<void> => {
    console.log("Sending user update roles request to server");
    await adminApi.put('/set-roles', userRoleUpdates);
};