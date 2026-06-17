import { useQuery } from "@tanstack/react-query";
import { getFieldWorks } from "../../services/FieldWorkService";

export const useFieldWorks = () => {
    return useQuery({
        queryKey: ["fieldWorks"],
        queryFn: getFieldWorks,
        refetchOnWindowFocus: false,
    }); 
}