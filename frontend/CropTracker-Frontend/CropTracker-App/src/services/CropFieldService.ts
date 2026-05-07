import axios from "axios"
import type { GetCropFieldData } from "../interfaces/response/GetCropFieldData"
import type { CreateCropFieldData } from "../interfaces/request/CreateCropFieldData"
import type { UpdateCropFieldData } from "../interfaces/request/UpdateCropFieldData"

export const cropFieldApi = axios.create({
    baseURL: "http://localhost:8080/api/cropfield",
    headers: {
        Accept: "application/json"
    }
})

export const createCropField = async(createCropField: CreateCropFieldData): Promise<void> => {
    console.log("Sending create-cropfield request to server");
    await cropFieldApi.post<void>("/create", createCropField, {
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
        }
    })
}

export const updateCropField = async(updateCropField: UpdateCropFieldData, cropFieldId: string): Promise<void> => {
    console.log("Sending update-cropfield request to server")
    await cropFieldApi.put<void>(`/update?id=${cropFieldId}`, updateCropField, {
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
        }
    })
}

export const getCropFields = async (): Promise<GetCropFieldData[]> => {
    console.log("Sending get-cropfields request to server")
    const response = await cropFieldApi.get<GetCropFieldData[]>("/findall", {
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    })

    return response.data
}

export const getCropFieldById = async (cropFieldId: string): Promise<GetCropFieldData> => {
    console.log("Sending get-cropfield request to server")
    const response = await cropFieldApi.get<GetCropFieldData>(`/findby?id=${cropFieldId}`, {
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    })

    return response.data
}

export const deleteCropFieldById = async (cropFieldId: string): Promise<void> => {
    console.log("Sending delete-cropfield request to server")
    const response = await cropFieldApi.delete<void>(`/delete?id=${cropFieldId}`, {
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    })

    return response.data
}