import axios from "axios";
import type { GetCropCategoryDTO } from "../interfaces/response/GetCropCategoryDTO";
import { attachAuthInterceptors } from "./AttachAuthInterceptors";

export const cropCategoryApi = axios.create({
    baseURL: "http://localhost:8080/api/crop-categories",
    headers: {
        Accept: "application/json"
    },
    withCredentials: true
});

attachAuthInterceptors(cropCategoryApi);

export const getCropCategories = async (): Promise<GetCropCategoryDTO[]> => {
    console.log("Sending get-cropcategories with pattern request to server")
    const response = await cropCategoryApi.get<GetCropCategoryDTO[]>("/findall");

    return response.data
}