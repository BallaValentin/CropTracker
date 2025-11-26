import axios from "axios"
import type { Plot } from "../interfaces/Plot"

export const plotApi = axios.create({
    baseURL: "http://localhost:8080/api/plot",
    headers: {
        Accept: "application/json"
    }
})

export const getPlots = async (): Promise<Plot[]> => {
    console.log("Sending get-plots request to server")
    const response = await plotApi.get<Plot[]>("/findall", {
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    })

    return response.data
}