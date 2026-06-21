import { useQuery } from "@tanstack/react-query";
import { getFieldParcel } from "../../services/FieldParcelService";

export const useFieldParcel = (fieldParcelId: string, enabled: boolean) => {
    return useQuery({
        enabled: enabled,
        queryKey: ["fieldParcels", fieldParcelId],
        queryFn: () => getFieldParcel(fieldParcelId),
        refetchOnWindowFocus: false,
    });
}