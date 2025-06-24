import axios from "axios";
import type { LoginData } from "../interfaces/LoginData";
import type { LoginResponse } from "../interfaces/LoginResponse";
import type { RegisterData } from "../interfaces/RegisterData";

export const authApi = axios.create({
    baseURL: "http://localhost:8080/api/auth",
    headers: {
        Accept: "application/json"
    },
    withCredentials: true
});

export const loginUser = async(loginData: LoginData): Promise<LoginResponse>  => {
    const response = await authApi.post<LoginResponse>("/signin", loginData);
    return response.data;
}

export const registerUser = async(registerData: RegisterData): Promise<number>  => {
    const response = await authApi.post<number>("/signup", registerData);
    return response.status;
}

