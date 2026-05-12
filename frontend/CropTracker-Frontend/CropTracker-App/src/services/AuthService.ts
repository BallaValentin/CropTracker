import axios from "axios";
import type { LoginUserDTO } from "../interfaces/request/LoginUserDTO";
import type { CreateUserDTO } from "../interfaces/request/CreateUserDTO";
import type { GetRefreshTokenDTO } from "../interfaces/response/GetRefreshTokenDTO";
import type { LoginResponseDTO } from "../interfaces/response/LoginResponseDTO";

export const authApi = axios.create({
    baseURL: "http://localhost:8080/api/auth",
    headers: {
        Accept: "application/json"
    },
    withCredentials: true
});

export const loginUser = async(loginData: LoginUserDTO): Promise<LoginResponseDTO>  => {
    console.log("Sending login request to server");
    const response = await authApi.post<LoginResponseDTO>("/login", loginData);
    const {accessToken} = response.data;
    sessionStorage.setItem('accessToken', accessToken);
    return response.data;
}

export const logoutUser = async(): Promise<number> => {
    console.log("Sending logout request to server");
    const response = await authApi.get<number>("/logout");
    return response.status;
}

export const registerUser = async(registerData: CreateUserDTO): Promise<number>  => {
    console.log("Sending sign up request to server")
    const response = await authApi.post<number>("/register", registerData);
    return response.status;
}

export const refreshToken = async(): Promise<GetRefreshTokenDTO> => {
    console.log("Sending refresh-token request to server")
    const response = await authApi.get<GetRefreshTokenDTO>("/refresh-token");
    return response.data;
} 

