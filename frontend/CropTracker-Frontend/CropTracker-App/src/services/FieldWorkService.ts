import axios from "axios";
import type { CreateFieldWorkDTO } from "../interfaces/request/CreateFieldWorkDTO";
import type { GetFieldWorkDTO } from "../interfaces/response/GetFieldWorkDTO";
import type { UpdateFieldWorkDTO } from "../interfaces/request/UpdateFieldWorkDTO";
import { attachAuthInterceptors } from "./AttachAuthInterceptors";
import type { GetPreviousWorkDTO } from "../interfaces/response/GetPreviousWorkDTO";

export const fieldWorkApi = axios.create({
    baseURL: "http://localhost:8080/api/field-works",
    headers: {
        Accept: "application/json"
    },
    withCredentials: true
});

attachAuthInterceptors(fieldWorkApi);

export const createFieldWork = async(createFieldWorkDTO: CreateFieldWorkDTO): Promise<void> => {
    console.log("Sending create-field-work request to server");
    await fieldWorkApi.post<void>("/create", createFieldWorkDTO);
}

export const updateFieldWork = async(updateFieldWorkDTO: UpdateFieldWorkDTO, fieldWorkId: string): Promise<void> => {
    console.log("Sending update-field-work request to server");
    await fieldWorkApi.put<void>("/update", updateFieldWorkDTO, {
        params: {
            fieldWorkId: fieldWorkId
        },
    });
}

export const getFieldWorksByPage = async(page: number, cropFieldId: string | null, workTypeId: string | null, size: number): Promise<GetPreviousWorkDTO[]> => {
    console.log("Sending get-field-works request to server");
    const response = await fieldWorkApi.get<GetPreviousWorkDTO[]>("/find-by-page", {
        params: {
            page: page,
            size: size,
            cropFieldId: cropFieldId,
            workTypeId: workTypeId
        }
    });
    console.log("Received response from server:", response.data);
    return response.data;
}

export const getFieldWorksByCropField = async(cropFieldId: string): Promise<GetFieldWorkDTO[]> => {
    console.log("Sending get-field-works request to server");
    const response = await fieldWorkApi.get<GetFieldWorkDTO[]>("/findall", {
        params: {
            cropFieldId: cropFieldId
        },
    });
    return response.data;
}

export const getFieldWork = async(fieldWorkId: string): Promise<GetFieldWorkDTO> => {
    console.log("Sending get-field-work request to server");
    const response = await fieldWorkApi.get<GetFieldWorkDTO>('/findby', {
        params: {
            id: fieldWorkId
        },
    })
    return response.data;
}

export const getPreviousWorks = async(cropFieldId: string, numberOfDays: number, referenceDate: string, selectedWorkTypes: string[]): Promise<GetPreviousWorkDTO[]> => {
    console.log("Sending get-previous-works to server");

    const response = await fieldWorkApi.get<GetPreviousWorkDTO[]>('/find-previous-works', {
        params: {
            cropFieldId: cropFieldId,
            numberOfDays: numberOfDays,
            referenceDate: referenceDate,
            workTypes: selectedWorkTypes.join(",")
        },
    });

    return response.data;
}