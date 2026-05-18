import axios from "axios";
import type { GetFieldParcelDTO } from "../interfaces/response/GetFieldParcelDTO";
import type { CreateFieldParcelDTO } from "../interfaces/request/CreateFieldParcelDTO";

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