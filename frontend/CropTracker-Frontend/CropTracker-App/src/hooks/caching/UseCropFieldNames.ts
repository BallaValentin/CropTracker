import { useQuery } from "@tanstack/react-query";
import { getCropFieldNames } from "../../services/CropFieldService";
import { type GetCropFieldNameDTO } from "../../interfaces/response/GetCropFieldNameDTO";

export const useCropFieldNames = (enabled: boolean) => {
    return useQuery<GetCropFieldNameDTO[]>({
        queryKey: ["cropfields"],
        queryFn: () => getCropFieldNames(""),
        enabled: enabled,
        refetchOnWindowFocus: false
    })
}