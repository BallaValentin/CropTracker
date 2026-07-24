import axios from "axios";
import type { GetCropCultivarDTO } from "../interfaces/response/GetCropCultivarDTO";
import type { CreateCropCultivarDTO } from "../interfaces/request/CreateCropCultivarDTO";
import type { UpdateCropCultivarDTO } from "../interfaces/request/UpdateCropCultivarDTO";
import { attachAuthInterceptors } from "./AttachAuthInterceptors";
import type { GetSimpleCropCultivarDTO } from "../interfaces/response/GetSimpleCropCultivarDTO";

export const cropCultivarApi = axios.create({
    baseURL: "http://localhost:8080/api/crop-cultivars",
    headers: {
        Accept: "application/json"
    },
    withCredentials: true
});

attachAuthInterceptors(cropCultivarApi);

export const getCropCultivarsWithPattern = async (pattern: string): Promise<GetSimpleCropCultivarDTO[]> => {
    console.log("Sending get-cropcultivars with pattern request to server")
    const response = await cropCultivarApi.get<GetSimpleCropCultivarDTO[]>("/findall", {
        params: {
            pattern: pattern
        },
    })

    return response.data
}

export const getCropCultivarsInSpecie = async (specieId: string): Promise<GetCropCultivarDTO[]> => {
    console.log(`Sending get-cropcultivars with with specie ${specieId} request to server`)
    const response = await cropCultivarApi.get<GetCropCultivarDTO[]>("/findall", {
        params: {
            specieId: specieId
        },
    })

    return response.data;
}

export const createCropCultivar = async (createCropCultivarDTO: CreateCropCultivarDTO): Promise<GetCropCultivarDTO> => {
    console.log("Sending create-cropcultivar request to server: ", createCropCultivarDTO)
    
    const response = await cropCultivarApi.post<GetCropCultivarDTO>("/create", createCropCultivarDTO);

    return response.data;

}

export const updateCropCultivar = async (updateCropCultivarDTO: UpdateCropCultivarDTO, cultivarId: string): Promise<GetCropCultivarDTO> => {
    console.log("Sending update-cropcultivar request to server: ", updateCropCultivarDTO)
    const response = await cropCultivarApi.put<GetCropCultivarDTO>("/update", updateCropCultivarDTO, {
        params: {
            id: cultivarId
        },
    });

    return response.data;
}

export const deleteCropCultivar = async (cultivarId: string): Promise<void> => {
    console.log(`Sending delete-cropcultivar with id ${cultivarId} request to server`)
    await cropCultivarApi.delete<void>("/delete", {
        params: {
            id: cultivarId
        },
    });
}