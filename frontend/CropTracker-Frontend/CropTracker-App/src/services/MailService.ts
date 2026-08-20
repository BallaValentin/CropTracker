import axios from "axios";
import type { PasswordVerificationEmailDTO } from "../interfaces/request/PasswordVerificationEmailDTO";


export const mailApi = axios.create({
    baseURL: "http://localhost:8080/api/mail",
    headers: {
        Accept: "application/json"
    },
    withCredentials: true
});

export const sendPasswordResetMail = async(passwordResetMail: PasswordVerificationEmailDTO): Promise<void> => {
    console.log("Sending password reset email")
    await mailApi.post("/reset-password", passwordResetMail);
} 