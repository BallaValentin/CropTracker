import axios from "axios";
import type { GetWorkTypeDTO } from "../interfaces/response/GetWorkTypeDTO";
import type { CreateWorkTypeDTO } from "../interfaces/request/CreateWorkTypeDTO";

export const workTypeApi = axios.create({
    baseURL: "http://localhost:8080/api/work-types",
    headers: {
        Accept: "application/json"
    }
})

export const getUserWorkTypes = async(): Promise<GetWorkTypeDTO[]> => {
    console.log("Sending get-work-type request to server");
    const response = await workTypeApi.get<GetWorkTypeDTO[]>("/findall", {
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
        }
    });

    return response.data;
}

export const createWorkType = async(createWorkTypeDTO: CreateWorkTypeDTO): Promise<void> => {
    console.log("Sending create-work-type request to server");

    await workTypeApi.post<void>("/create", createWorkTypeDTO, {
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
        }
    })
}