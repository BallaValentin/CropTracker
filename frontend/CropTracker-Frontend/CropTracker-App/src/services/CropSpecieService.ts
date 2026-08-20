import axios from "axios";
import type { GetCropSpecieDTO } from "../interfaces/response/GetCropSpecieDTO";
import type { CreateCropSpecieDTO } from "../interfaces/request/CreateCropSpecieDTO";
import type { UpdateCropSpecieDTO } from "../interfaces/request/UpdateCropSpecieDTO";
import { attachAuthInterceptors } from "./AttachAuthInterceptors";

export const cropSpecieApi = axios.create({
    baseURL: "http://localhost:8080/api/crop-species",
    headers: {
        Accept: "application/json"
    },
    withCredentials: true
});

attachAuthInterceptors(cropSpecieApi);

export const getCropSpecieInCategory = async (categoryId: string): Promise<GetCropSpecieDTO[]> => {
    console.log("Sending get-cropspecies with patterb request to server")
    const response = await cropSpecieApi.get<GetCropSpecieDTO[]>("/findall", {
        params: {
            categoryId: categoryId,
        },
    })

    return response.data
}

export const createCropSpecie = async (createCropSpecieDTO: CreateCropSpecieDTO): Promise<GetCropSpecieDTO> => {
    console.log("Sending get-cropspecies with pattern request to server", createCropSpecieDTO)
    
    const response = await cropSpecieApi.post<GetCropSpecieDTO>("/create", createCropSpecieDTO);

    return response.data;
}

export const updateCropSpecie = async (updateCropSpecieDTO: UpdateCropSpecieDTO, cropSpecieId: string): Promise<GetCropSpecieDTO> => {
    console.log("Sending update-cropspecies with pattern request to server", updateCropSpecieDTO);
    const response = await cropSpecieApi.put<GetCropSpecieDTO>("/update", updateCropSpecieDTO, {
        params: {
            id: cropSpecieId
        },
    });

    return response.data;
}
export const deleteCropSpecie = async (cropSpecieId: string): Promise<void> => {
    console.log(`Sending delete-cropspecies with ${cropSpecieId} id`)
    const response = await cropSpecieApi.delete<void>("/delete", {
        params: {
            id: cropSpecieId
        },
    })

    return response.data
}