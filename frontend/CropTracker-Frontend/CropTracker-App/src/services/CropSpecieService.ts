import axios from "axios";
import type { GetCropSpecieDTO } from "../interfaces/response/GetCropSpecieDTO";
import type { CreateCropSpecieDTO } from "../interfaces/request/CreateCropSpecieDTO";

export const cropSpecieApi = axios.create({
    baseURL: "http://localhost:8080/api/crop-species",
    headers: {
        Accept: "application/json"
    },
    withCredentials: true
});

export const getCropSpecieInCategory = async (categoryId: string): Promise<GetCropSpecieDTO[]> => {
    console.log("Sending get-cropcultivars with patterb request to server")
    const response = await cropSpecieApi.get<GetCropSpecieDTO[]>("/findall", {
        params: {
            categoryId: categoryId,
        },
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    })

    return response.data
}

export const createCropSpecie = async (createCropSpecieDTO: CreateCropSpecieDTO): Promise<void> => {
    console.log("Sending get-cropcultivars with patterb request to server", createCropSpecieDTO)
    const response = await cropSpecieApi.post<void>("/create", createCropSpecieDTO, {
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    })

    return response.data
}