import axios from "axios";
import type { PasswordResetMail } from "../interfaces/PasswordResetMail";

export const mailApi = axios.create({
    baseURL: "http://localhost:8080/api/mail",
    headers: {
        Accept: "application/json"
    }
});

export const sendPasswordResetMail = async(passwordResetMail: PasswordResetMail): Promise<void> => {
    console.log("Sending password reset email")
    await mailApi.post("/reset-password", passwordResetMail);
} 