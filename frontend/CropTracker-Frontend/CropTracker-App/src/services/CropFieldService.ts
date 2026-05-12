import axios from "axios"
import type { GetCropFieldDTO } from "../interfaces/response/GetCropFieldDTO"
import type { CreateCropFieldDTO } from "../interfaces/request/CreateCropFieldDTO"
import type { UpdateCropFieldDTO } from "../interfaces/request/UpdateCropFieldDTO"

export const cropFieldApi = axios.create({
    baseURL: "http://localhost:8080/api/cropfield",
    headers: {
        Accept: "application/json"
    }
})

export const createCropField = async(createCropField: CreateCropFieldDTO): Promise<void> => {
    console.log("Sending create-cropfield request to server");
    await cropFieldApi.post<void>("/create", createCropField, {
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
        }
    })
}

export const updateCropField = async(updateCropField: UpdateCropFieldDTO, cropFieldId: string): Promise<void> => {
    console.log("Sending update-cropfield request to server")
    await cropFieldApi.put<void>(`/update?id=${cropFieldId}`, updateCropField, {
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
        }
    })
}

export const getCropFields = async (): Promise<GetCropFieldDTO[]> => {
    console.log("Sending get-cropfields request to server")
    const response = await cropFieldApi.get<GetCropFieldDTO[]>("/findall", {
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    })

    return response.data
}

export const getCropFieldById = async (cropFieldId: string): Promise<GetCropFieldDTO> => {
    console.log("Sending get-cropfield request to server")
    const response = await cropFieldApi.get<GetCropFieldDTO>(`/findby?id=${cropFieldId}`, {
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