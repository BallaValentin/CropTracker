import { useQuery } from "@tanstack/react-query";
import { getCropFieldById } from "../../services/CropFieldService";

export const useCropField = (id: string, enabled: boolean) => {
    return useQuery({
        queryKey: ["cropfields", id],
        queryFn: () => getCropFieldById(id),
        refetchOnWindowFocus: false,
        enabled: enabled
    }); 
}