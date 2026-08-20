import { useQuery } from "@tanstack/react-query";
import { getCropFieldByFieldWorkId } from "../../services/CropFieldService";

export const useFieldWorkCropField = (id: string, enabled?: boolean) => {
    return useQuery({
        queryKey: ["cropfields", id],
        queryFn: () => getCropFieldByFieldWorkId(id),
        refetchOnWindowFocus: false,
        enabled: enabled
    }); 
}