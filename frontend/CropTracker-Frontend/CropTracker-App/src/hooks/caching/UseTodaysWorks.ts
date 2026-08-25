import { useQuery } from "@tanstack/react-query";
import { getFieldWorksByToday } from "../../services/FieldWorkService";

export const useTodaysFieldWorks = (enabled: boolean) => {
    return useQuery({
        queryKey: ["fieldWorks"],
        queryFn: () => getFieldWorksByToday(),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: enabled
    }); 
}