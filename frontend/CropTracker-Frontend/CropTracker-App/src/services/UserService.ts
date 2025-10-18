import axios from "axios";
import type { AvatarUpdates } from "../interfaces/AvatarUpdates";
import type { UserData } from "../interfaces/UserData";

export const userApi = axios.create({
    baseURL: "http://localhost:8080/api/user",
    headers: {
        Accept: "application/json"
    }
});

export const updateAvatar = async(newAvatarSrc: string): Promise<number>  => {
    const avatarUpdates: AvatarUpdates = {
        newAvatarSrc
    }
    console.log('Sending avatar-update request to server');
    const response = await userApi.put<number>("/change-avatar", avatarUpdates, {
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    });
    return response.status;
}

export const fetchUserData = async(): Promise<UserData> => {
    console.log('Sending fetch user data request to server');
    const response = await userApi.get<UserData>("/fetch-user-data", {
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    });
    return response.data;
}

export const getAvatar = async(): Promise<Blob> => {
    console.log('Sending get avatar request to server');
    const response = await userApi.get<Blob>("/get-avatar", {
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        },
        responseType: 'blob'
    })

    return response.data
}