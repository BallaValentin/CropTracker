import axios from "axios";
import type { CreateFieldWorkDTO } from "../interfaces/request/CreateFieldWorkDTO";

export const cropFieldApi = axios.create({
    baseURL: "http://localhost:8080/api/field-works",
    headers: {
        Accept: "application/json"
    }
})

export const createFieldWork = async(createFieldWorkDTO: CreateFieldWorkDTO): Promise<void> => {
    console.log("Sending create-field-work request to server");
    await cropFieldApi.post<void>("/create", createFieldWorkDTO, {
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
        }
    })
}