import { useQuery } from "@tanstack/react-query";
import { getUserWorkTypes } from "../../services/WorkTypeService";

export const useWorkTypes = () => {
    return useQuery({
            queryKey: ["workTypes"],
            queryFn: () => getUserWorkTypes(),
            refetchOnWindowFocus: false,
        });
}