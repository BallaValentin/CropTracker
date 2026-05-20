import axios from "axios";
import type { GetFieldParcelDTO } from "../interfaces/response/GetFieldParcelDTO";
import type { CreateFieldParcelDTO } from "../interfaces/request/CreateFieldParcelDTO";
import type { UpdateFieldParcelDTO } from "../interfaces/request/UpdateFieldParcelDTO";

export const cropFieldApi = axios.create({
    baseURL: "http://localhost:8080/api/field-parcel",
    headers: {
        Accept: "application/json"
    }
})

export const getFieldParcells = async(cropFieldId: string): Promise<GetFieldParcelDTO[]> => {
    console.log("Sending get-field-parcels request to server for cropFieldId:", cropFieldId);
        const response = await cropFieldApi.get<GetFieldParcelDTO[]>('/findall', {
            params: {
                cropFieldId: cropFieldId
            },
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        });

        return response.data;
}

export const createFieldParcel = async(createFieldParcelDTO: CreateFieldParcelDTO): Promise<void> => {
    console.log("Sending create-field-parcel request to server");
        await cropFieldApi.post("/create", createFieldParcelDTO, {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        });
}

export const updateFieldParcel = async(updateFieldParcelDTO: UpdateFieldParcelDTO, fieldParcelId: string): Promise<void> => {
    console.log("Sending update-field-parcel request to server");
        await cropFieldApi.put("/update", updateFieldParcelDTO, {
            params: {
                id: fieldParcelId
            },
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        });
}

export const deleteFieldParcel = async(fieldParcelId: string): Promise<void> => {
    console.log("Sending delete-field-parcel request to server");
        await cropFieldApi.delete("/delete", {
            params: {
                id: fieldParcelId
            },
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        });
}