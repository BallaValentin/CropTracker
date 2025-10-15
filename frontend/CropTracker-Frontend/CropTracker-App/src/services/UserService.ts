import axios from "axios";
import type { AvatarUpdates } from "../interfaces/AvatarUpdates";

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