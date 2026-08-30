import axios from "axios";
import type { GetWorkTypeDTO } from "../interfaces/response/GetWorkTypeDTO";
import type { CreateWorkTypeDTO } from "../interfaces/request/CreateWorkTypeDTO";
import { attachAuthInterceptors } from "./AttachAuthInterceptors";
import type { GetWorkTypeNameDTO } from "../interfaces/response/GetWorkTypeNameDTO";

export const workTypeApi = axios.create({
    baseURL: "http://localhost:8080/api/work-types",
    headers: {
        Accept: "application/json"
    }
});

attachAuthInterceptors(workTypeApi);

export const getUserWorkTypes = async(): Promise<GetWorkTypeDTO[]> => {
    console.log("Sending get-work-type request to server");
    const response = await workTypeApi.get<GetWorkTypeDTO[]>("/findall");
    console.log("Received work types: ", response.data);
    return response.data;
}

export const getWorkTypeNames = async(pattern: string): Promise<GetWorkTypeNameDTO[]> => {
    console.log("Sending get-work-type-names request to server");
    const response = await workTypeApi.get<GetWorkTypeNameDTO[]>("/findall", {
        params: {
            pattern: pattern
        }
    });

    console.log("Received response from server:", response.data);
    return response.data;
}

export const getWorkTypeById = async(workTypeId: string): Promise<GetWorkTypeDTO> => {
    console.log("Sending get-work-type-by-id request to server");
    const response = await workTypeApi.get<GetWorkTypeDTO>("/find-by-id", {
        params: {
            workTypeId: workTypeId
        }
    });

    console.log("Received response from server:", response.data);
    return response.data;
}

export const createWorkType = async(createWorkTypeDTO: CreateWorkTypeDTO): Promise<void> => {
    console.log("Sending create-work-type request to server");

    await workTypeApi.post<void>("/create", createWorkTypeDTO);
}