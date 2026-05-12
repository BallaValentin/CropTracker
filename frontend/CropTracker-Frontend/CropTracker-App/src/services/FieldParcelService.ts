import axios from "axios";
import type { GetFieldParcelDTO } from "../interfaces/response/GetFieldParcelDTO";

export const cropFieldApi = axios.create({
    baseURL: "http://localhost:8080/api/field-parcel",
    headers: {
        Accept: "application/json"
    }
})

export const getFieldParcells = async(cropFieldId: number): Promise<GetFieldParcelDTO[]> => {
    console.log("Sending create-cropfield request to server");
        const response = await cropFieldApi.get<GetFieldParcelDTO[]>(`/findall?cropFieldId=${cropFieldId}`, {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        });

        return response.data;
}