import axios from "axios";
import type { GetCropCategoryDTO } from "../interfaces/response/GetCropCategoryDTO";

export const cropCultivarApi = axios.create({
    baseURL: "http://localhost:8080/api/crop-categories",
    headers: {
        Accept: "application/json"
    },
    withCredentials: true
});

export const getCropCategories = async (): Promise<GetCropCategoryDTO[]> => {
    console.log("Sending get-cropcategories with pattern request to server")
    const response = await cropCultivarApi.get<GetCropCategoryDTO[]>("/findall", {
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    })

    return response.data
}