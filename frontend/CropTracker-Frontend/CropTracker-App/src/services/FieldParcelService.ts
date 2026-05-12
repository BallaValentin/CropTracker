import axios from "axios";
import type { GetFieldParcelData } from "../interfaces/response/GetFieldParcelData";

export const cropFieldApi = axios.create({
    baseURL: "http://localhost:8080/api/field-parcel",
    headers: {
        Accept: "application/json"
    }
})

export const getFieldParcells = async(cropFieldId: number): Promise<GetFieldParcelData[]> => {
    console.log("Sending create-cropfield request to server");
        const response = await cropFieldApi.get<GetFieldParcelData[]>(`/findall?cropFieldId=${cropFieldId}`, {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        });

        return response.data;
}