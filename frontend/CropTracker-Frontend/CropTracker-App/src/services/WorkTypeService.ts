import axios from "axios";
import type { GetWorkTypeDTO } from "../interfaces/response/GetWorkTypeDTO";

export const cropFieldApi = axios.create({
    baseURL: "http://localhost:8080/api/work-types",
    headers: {
        Accept: "application/json"
    }
})

export const getUserWorkTypes = async(): Promise<GetWorkTypeDTO[]> => {
    console.log("Sending get-work-type request to server");
    const response = await cropFieldApi.get<GetWorkTypeDTO[]>("/findall", {
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
        }
    });

    return response.data;
}