import axios from "axios";
import type { LoginData } from "../interfaces/request/LoginData";
import type { LoginResponse } from "../interfaces/request/LoginResponse";
import type { RegisterData } from "../interfaces/request/RegisterData";
import type { RefreshTokenResponse } from "../interfaces/response/RefreshTokenResponse";

export const authApi = axios.create({
    baseURL: "http://localhost:8080/api/auth",
    headers: {
        Accept: "application/json"
    },
    withCredentials: true
});

export const loginUser = async(loginData: LoginData): Promise<LoginResponse>  => {
    console.log("Sending login request to server");
    const response = await authApi.post<LoginResponse>("/login", loginData);
    const {accessToken} = response.data;
    sessionStorage.setItem('accessToken', accessToken);
    return response.data;
}

export const logoutUser = async(): Promise<number> => {
    console.log("Sending logout request to server");
    const response = await authApi.get<number>("/logout");
    return response.status;
}

export const registerUser = async(registerData: RegisterData): Promise<number>  => {
    console.log("Sending sign up request to server")
    const response = await authApi.post<number>("/register", registerData);
    return response.status;
}

export const refreshToken = async(): Promise<RefreshTokenResponse> => {
    console.log("Sending refresh-token request to server")
    const response = await authApi.get<RefreshTokenResponse>("/refresh-token");
    return response.data;
} 

