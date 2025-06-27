import axios from "axios";
import type { LoginData } from "../interfaces/LoginData";
import type { LoginResponse } from "../interfaces/LoginResponse";
import type { RegisterData } from "../interfaces/RegisterData";
import type { RefreshTokenResponse } from "../interfaces/RefreshTokenResponse";

export const authApi = axios.create({
    baseURL: "http://localhost:8080/api/auth",
    headers: {
        Accept: "application/json"
    },
    withCredentials: true
});

export const loginUser = async(loginData: LoginData): Promise<LoginResponse>  => {
    const response = await authApi.post<LoginResponse>("/authenticate", loginData);
    const {accessToken} = response.data;
    sessionStorage.setItem('accesToken', accessToken);
    return response.data;
}

export const registerUser = async(registerData: RegisterData): Promise<number>  => {
    const response = await authApi.post<number>("/register", registerData);
    return response.status;
}

export const refreshToken = async(): Promise<RefreshTokenResponse> => {
    const response = await authApi.post<RefreshTokenResponse>("/refresh-token");
    return response.data;
} 

