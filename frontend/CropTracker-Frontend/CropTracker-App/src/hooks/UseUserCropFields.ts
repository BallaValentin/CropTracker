import { useQuery } from "@tanstack/react-query";
import type { GetCropFieldDTO } from "../interfaces/response/GetCropFieldDTO"
import { getCropFields } from "../services/CropFieldService"
import type { AxiosError } from "axios";

export const useUserCropFields = () => {
    const query = useQuery<GetCropFieldDTO[], AxiosError>({
        queryKey: ["cropfields"],
        queryFn: getCropFields,
        staleTime: 1000 * 60 * 60,
        refetchInterval: 1000 * 60 * 60,
    })

    return query;
}