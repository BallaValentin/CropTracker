import axios from "axios";
import type { GetFieldParcelDTO } from "../interfaces/response/GetFieldParcelDTO";
import type { CreateFieldParcelDTO } from "../interfaces/request/CreateFieldParcelDTO";
import type { UpdateFieldParcelDTO } from "../interfaces/request/UpdateFieldParcelDTO";
import { attachAuthInterceptors } from "./AttachAuthInterceptors";

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

        console.log("Received field parcels from server: ", response.data)
        return response.data;
}

export const createFieldParcel = async(createFieldParcelDTO: CreateFieldParcelDTO): Promise<void> => {
    console.log("Sending create-field-parcel request to server");
        await fieldParcelApi.post("/create", createFieldParcelDTO);
}

export const updateFieldParcel = async(updateFieldParcelDTO: UpdateFieldParcelDTO, fieldParcelId: string): Promise<void> => {
    console.log("Sending update-field-parcel request to server");
        await fieldParcelApi.put("/update", updateFieldParcelDTO, {
            params: {
                id: fieldParcelId
            },
        });
}

export const deleteFieldParcel = async(fieldParcelId: string): Promise<string> => {
    console.log("Sending delete-field-parcel request to server");
    await fieldParcelApi.delete("/delete", {
        params: {
            id: fieldParcelId
        },
    });

    return fieldParcelId;
}