import axios from "axios";
import type { CreateFieldWorkDTO } from "../interfaces/request/CreateFieldWorkDTO";
import type { GetFieldWorkDTO } from "../interfaces/response/GetFieldWorkDTO";
import type { UpdateFieldWorkDTO } from "../interfaces/request/UpdateFieldWorkDTO";
import { attachAuthInterceptors } from "./AttachAuthInterceptors";
import type { GetPreviousWorkDTO } from "../interfaces/response/GetPreviousWorkDTO";
import type { GetWorkStatDTO } from "../interfaces/response/GetWorkStatDTO";

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
    console.log("Sending update-field-work request to server: ", updateFieldWorkDTO);
    await fieldWorkApi.put<void>("/update", updateFieldWorkDTO, {
        params: {
            fieldWorkId: fieldWorkId
        },
    });
}

export const getFieldWorksByCursor = async(lastSeen: string | null, checkedCropFieldIds: string[], checkedWorkTypeIds: string[], size: number): Promise<GetPreviousWorkDTO[]> => {
    const workTypeIdsParam = checkedWorkTypeIds.join(",");
    const cropFieldIdsParam = checkedCropFieldIds.join(",");
    console.log("Sending get-field-works request to server: ", checkedCropFieldIds);
    const response = await fieldWorkApi.get<GetPreviousWorkDTO[]>("/find-by-page", {
        params: {
            lastSeen: lastSeen,
            size: size,
            cropFieldIds: cropFieldIdsParam,
            workTypeIds: workTypeIdsParam
        }
    });
    console.log("Received response from server:", response.data);
    return response.data;
}

export const getFieldWorksWithinDays = async (numberOfDays: number =  365): Promise<GetWorkStatDTO[]> => {
    console.log("Sending get-field-works-stats to server");
    const response = await fieldWorkApi.get<GetWorkStatDTO[]>("/get-work-stats", {
        params: {
            numberOfDays: numberOfDays
        }
    });

    return response.data;
}

export const getFieldWorksByCropField = async(cropFieldId: string): Promise<GetFieldWorkDTO[]> => {
    console.log("Sending get-field-works request to server for crop field ID:", cropFieldId);
    const response = await fieldWorkApi.get<GetFieldWorkDTO[]>("/findall", {
        params: {
            cropFieldId: cropFieldId
        },
    });
    return response.data;
}

export const getFieldWorksByToday = async(): Promise<GetPreviousWorkDTO[]> => {
    console.log("Sending get-field-works request to server for todays works");
    const response = await fieldWorkApi.get<GetPreviousWorkDTO[]>("/findall-by-day", {
        params: {
            userDateTime: new Date().toISOString()
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

export const getFieldWorkVersion = async(fieldWorkId: string): Promise<GetFieldWorkDTO> => {
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

export const deleteSelectedFieldWorks = async(fieldWorkIds: string[] | string): Promise<void> => {
    console.log("Sending delete-field-works request to server");
    const idsParam = Array.isArray(fieldWorkIds) ? fieldWorkIds.join(",") : fieldWorkIds;
    await fieldWorkApi.delete<void>("/delete", {
        params: {
            fieldWorkIds: idsParam
        },
    });
}