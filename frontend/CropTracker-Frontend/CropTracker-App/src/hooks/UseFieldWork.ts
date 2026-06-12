import { useQuery } from "@tanstack/react-query";
import { getFieldWork } from "../services/FieldWorkService";

export const useFieldWork = (id: string, enabled: boolean) => {
    return useQuery({
        queryKey: ["fieldWork", id],
        queryFn: () => getFieldWork(id),
        refetchOnWindowFocus: false,
        enabled: enabled
    }); 
}