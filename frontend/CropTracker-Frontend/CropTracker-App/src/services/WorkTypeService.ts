import axios from "axios";
import type { GetWorkTypeDTO } from "../interfaces/response/GetWorkTypeDTO";
import type { CreateWorkTypeDTO } from "../interfaces/request/CreateWorkTypeDTO";
import { attachAuthInterceptors } from "./AttachAuthInterceptors";

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

    return response.data;
}

export const createWorkType = async(createWorkTypeDTO: CreateWorkTypeDTO): Promise<void> => {
    console.log("Sending create-work-type request to server");

    await workTypeApi.post<void>("/create", createWorkTypeDTO);
}