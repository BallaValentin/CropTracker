import type {  AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import type { GetRefreshTokenDTO } from "../interfaces/response/GetRefreshTokenDTO";
import axios from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const attachAuthInterceptors = (axiosInstance: AxiosInstance) => {
    axiosInstance.interceptors.request.use(
        config => {
            config.headers['Authorization'] = `Bearer ${sessionStorage.getItem('accessToken')}`;
            return config;
        },
        (error) => Promise.reject(error)
    );
    
    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as CustomAxiosRequestConfig;
    
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                console.log("Sending get-refresh-token request to server");
                const response: GetRefreshTokenDTO = (await axios.post(
                    "http://localhost:8080/api/auth/refresh-token", {}, {withCredentials: true})).data;
                const newAccessToken = response.accessToken;
    
                sessionStorage.setItem('accessToken', newAccessToken);
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
    
                return axiosInstance(originalRequest);
                } catch(refreshError) {
                    sessionStorage.removeItem('accessToken');

                    const isAlreadyAtUnauthorized = 
                        window.location.pathname === '/' && 
                        window.location.search === '?error=unauthorized';

                    if (!isAlreadyAtUnauthorized) {
                        window.location.href = "/?error=unauthorized";
                    }
                    
                    return Promise.reject(refreshError);
                }
            }

            if (error.response?.status !== 401) {
                return Promise.reject(error);
            }

        }
    );
}