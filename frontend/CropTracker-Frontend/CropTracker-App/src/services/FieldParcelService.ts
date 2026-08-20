import axios from "axios";
import type { GetFieldParcelDTO } from "../interfaces/response/GetFieldParcelDTO";
import type { CreateFieldParcelDTO } from "../interfaces/request/CreateFieldParcelDTO";
import type { UpdateFieldParcelDTO } from "../interfaces/request/UpdateFieldParcelDTO";
import { attachAuthInterceptors } from "./AttachAuthInterceptors";
import type { ConfirmUpdateDTO } from "../interfaces/response/ConfirmUpdateDTO";

export const fieldParcelApi = axios.create({
    baseURL: "http://localhost:8080/api/field-parcel",
    headers: {
        Accept: "application/json"
    }
});

attachAuthInterceptors(fieldParcelApi);

export const getFieldParcells = async(cropFieldId: string): Promise<GetFieldParcelDTO[]> => {
    console.log("Sending get-field-parcels request to server for cropFieldId:", cropFieldId);
        const response = await fieldParcelApi.get<GetFieldParcelDTO[]>('/findall', {
            params: {
                cropFieldId: cropFieldId
            },
        });

        console.log("Received field parcels from server: ", response.data)
        return response.data;
}

export const getFieldParcelsOfVersion = async(cropFieldVersionId: string): Promise<GetFieldParcelDTO[]> => {
    console.log("Sending get-field-parcels-of-version request to server for cropFieldId:", cropFieldVersionId);
    const response = await fieldParcelApi.get<GetFieldParcelDTO[]>('/findall', {
        params: {
            cropFieldVersionId: cropFieldVersionId
        },
    });

    return response.data;
}

export const getFieldParcel = async(fieldParcelId: string): Promise<GetFieldParcelDTO> => {
    console.log("Sending get-field-parcel request to server, for fieldParcelId:", fieldParcelId);
        const response = await fieldParcelApi.get<GetFieldParcelDTO>('/findby', {
            params: {
                fieldParcelId: fieldParcelId
            },
        });

        return response.data;
}

export const createFieldParcel = async(createFieldParcelDTO: CreateFieldParcelDTO, confirmUpdate: boolean): Promise<ConfirmUpdateDTO | null> => {
    console.log("Sending create-field-parcel request to server");
    const response = await fieldParcelApi.post<ConfirmUpdateDTO>("/create", createFieldParcelDTO, {
        params: {
            confirm: confirmUpdate
        }
    });
    return response.data || null;
}

export const updateFieldParcel = async(updateFieldParcelDTO: UpdateFieldParcelDTO, fieldParcelId: string, confirmUpdate: boolean): Promise<ConfirmUpdateDTO | null> => {
    console.log("Sending update-field-parcel request to server");
    const response = await fieldParcelApi.put<ConfirmUpdateDTO>("/update", updateFieldParcelDTO, {
            params: {
                id: fieldParcelId,
                confirm: confirmUpdate
            },
        });

    return response.data;
}

export const deleteFieldParcel = async(fieldParcelId: string, confirmUpdate: boolean): Promise<ConfirmUpdateDTO | null> => {
    console.log("Sending delete-field-parcel request to server");
    const response = await fieldParcelApi.delete("/delete", {
        params: {
            id: fieldParcelId,
            confirm: confirmUpdate
        },
    });

    return response.data;
}