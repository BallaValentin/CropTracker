import axios from "axios";
import type { UpdateUserDTO } from "../interfaces/request/UpdateUserDTO";
import type { ChangePasswordData } from "../interfaces/request/UpdatePasswordDTO";
import type { GetUserDTO } from "../interfaces/response/GetUserDTO";
import { attachAuthInterceptors } from "./AttachAuthInterceptors";
import type { CacheUserData } from "../interfaces/response/CacheUserData";

export const userApi = axios.create({
    baseURL: "http://localhost:8080/api/user",
    headers: {
        Accept: "application/json"
    }
});

attachAuthInterceptors(userApi);

export const updateProfile = async(userUpdates: UpdateUserDTO): Promise<GetUserDTO>  => {
    console.log('Sending update-profile request to server');
    const response = await userApi.put<GetUserDTO>("/update-profile", userUpdates);
    return response.data;
}

export const fetchUserData = async(): Promise<GetUserDTO> => {
    console.log('Sending fetch user data request to server');
    const response = await userApi.get<GetUserDTO>("/fetch-user-data");
    return response.data;
}

export const getUserData = async(): Promise<CacheUserData> => {
    const [userData, userAvatar] = await Promise.all([
        fetchUserData(),
        getAvatar()
    ]);

    const avatarUrl = URL.createObjectURL(userAvatar);

    const cachedUserData: CacheUserData = {
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        roles: userData.roles,
        avatarURL: avatarUrl
    };

    return cachedUserData;
}

export const getAvatar = async(): Promise<Blob> => {
    console.log('Sending get avatar request to server');
    const response = await userApi.get<Blob>("/get-avatar", {
        responseType: 'blob'
    })

    return response.data
}

export const updatePassword = async(changePasswordData: ChangePasswordData): Promise<void> => {
    console.log('Sending update password request to server');
    await userApi.put<void>("/update-password", changePasswordData)
}