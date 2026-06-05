import axios from "axios";
import type { CreateFieldWorkDTO } from "../interfaces/request/CreateFieldWorkDTO";
import type { GetFieldWorkDTO } from "../interfaces/response/GetFieldWorkDTO";
import type { GetAffectedRowsDTO } from "../interfaces/response/GetAffectedRowsDTO";

export const cropFieldApi = axios.create({
    baseURL: "http://localhost:8080/api/field-works",
    headers: {
        Accept: "application/json"
    }
})

export const createFieldWork = async(createFieldWorkDTO: CreateFieldWorkDTO): Promise<void> => {
    console.log("Sending create-field-work request to server");
    await cropFieldApi.post<void>("/create", createFieldWorkDTO, {
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
        }
    })
}

export const getFieldWorks = async(): Promise<GetFieldWorkDTO[]> => {
    console.log("Sending get-field-works request to server");
    const response = await cropFieldApi.get<GetFieldWorkDTO[]>("/findall", {
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
        }
    })
    return response.data;
}

export const getFieldWork = async(fieldWorkId: string): Promise<GetFieldWorkDTO> => {
    console.log("Sending get-field-work request to server");
    const response = await cropFieldApi.get<GetFieldWorkDTO>('/findby', {
        params: {
            id: fieldWorkId
        },
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
        }
    })
    return response.data;
}

export const getPreviousRows = async(cropFieldId: string, numberOfDays: number, referenceDate: string, selectedWorkTypes: string[]): Promise<GetAffectedRowsDTO> => {
    console.log("Sending get-previous-rows to server");

    const response = await cropFieldApi.get<GetAffectedRowsDTO>('/findRows', {
        params: {
            cropFieldId: cropFieldId,
            numberOfDays: numberOfDays,
            referenceDate: referenceDate,
            workTypes: selectedWorkTypes.join(",")
        },
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
        }
    });

    return response.data;
}