import axios from "axios"
import type { Plot } from "../interfaces/Plot"
import type { PostPlot } from "../interfaces/request/PostPlot"
import type { UpdatePlot } from "../interfaces/request/UpdatePlot"

export const plotApi = axios.create({
    baseURL: "http://localhost:8080/api/plot",
    headers: {
        Accept: "application/json"
    }
})

export const createPlot = async(postPlot: PostPlot): Promise<void> => {
    console.log("Sending create-plot request to server")
    await plotApi.post<void>("/create", postPlot, {
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
        }
    })
}

export const updatePlot = async(updatePlot: UpdatePlot, plotId: string): Promise<void> => {
    console.log("Sending create-plot request to server")
    await plotApi.post<void>(`/update?id=${plotId}`, updatePlot, {
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
        }
    })
}

export const getPlots = async (): Promise<Plot[]> => {
    console.log("Sending get-plots request to server")
    const response = await plotApi.get<Plot[]>("/findall", {
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    })

    return response.data
}