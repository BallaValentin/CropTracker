import { useQuery } from "@tanstack/react-query";
import { getWorkTypeById } from "../../services/WorkTypeService";

export const useWorkTypeByID = (workTypeId: string, enabled: boolean) => {
    return useQuery({
            queryKey: ["workTypes", workTypeId],
            queryFn: () => getWorkTypeById(workTypeId),
            enabled: enabled,
            refetchOnWindowFocus: false,
        });
}