import { useQuery } from "@tanstack/react-query";
import { getFieldWorksByCropField } from "../../services/FieldWorkService";

export const useCropFieldWork = (cropFieldId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ["fieldWorks", cropFieldId],
        queryFn: () => getFieldWorksByCropField(cropFieldId),
        refetchOnWindowFocus: false,
        enabled: enabled
    }); 
}