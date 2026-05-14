import axios from "axios";
import type { GetCropCultivarDTO } from "../interfaces/response/GetCropCultivarDTO";
import type { CreateCropCultivarDTO } from "../interfaces/request/CreateCropCultivarDTO";

export const cropCultivarApi = axios.create({
    baseURL: "http://localhost:8080/api/crop-cultivars",
    headers: {
        Accept: "application/json"
    },
    withCredentials: true
});

export const getCropCultivarsWithPattern = async (pattern: string): Promise<GetCropCultivarDTO[]> => {
    console.log("Sending get-cropcultivars with pattern request to server")
    const response = await cropCultivarApi.get<GetCropCultivarDTO[]>("/findall", {
        params: {
            pattern: pattern
        },
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    })

    return response.data
}

export const getCropCultivarsInSpecie = async (specieId: string): Promise<GetCropCultivarDTO[]> => {
    console.log(`Sending get-cropcultivars with with specie ${specieId} request to server`)
    const response = await cropCultivarApi.get<GetCropCultivarDTO[]>("/findall", {
        params: {
            specieId: specieId
        },
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    })

    return response.data;
}

export const createCropCultivar = async (createCropCultivarDTO: CreateCropCultivarDTO): Promise<GetCropCultivarDTO> => {
    console.log("Sending create-cropcultivar request to server: ", createCropCultivarDTO)
    
    const response = await cropCultivarApi.post<GetCropCultivarDTO>("/create", createCropCultivarDTO, {
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    });

    return response.data;

}