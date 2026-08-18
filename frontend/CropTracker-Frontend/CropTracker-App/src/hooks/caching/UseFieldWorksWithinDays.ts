import { useQuery } from "@tanstack/react-query";
import { getFieldWorksWithinDays } from "../../services/FieldWorkService";

export const useFieldWorksWithDays = (numberOfDays: number | undefined = 365, enabled: boolean) => {
    return useQuery({
        queryKey: ["fieldWorks", numberOfDays],
        queryFn: () => getFieldWorksWithinDays(numberOfDays),
        refetchOnWindowFocus: false,
        enabled: enabled
    }); 
}