import { useQuery } from "@tanstack/react-query";
import type { GetCropFieldData } from "../interfaces/response/GetCropFieldData"
import { getCropFields } from "../services/CropFieldService"
import type { AxiosError } from "axios";

export const useUserCropFields = () => {
    const query = useQuery<GetCropFieldData[], AxiosError>({
        queryKey: ["cropfields"],
        queryFn: getCropFields,
        staleTime: 1000 * 60 * 60,
        refetchInterval: 1000 * 60 * 60,
    })

    return query;
}