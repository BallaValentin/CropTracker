import { useQuery } from "@tanstack/react-query";
import { getFieldParcelsOfVersion } from "../../services/FieldParcelService";

export const useCropFieldVersionParcels = (cropFieldId: string, enabled: boolean) => {
    return useQuery({
        enabled: enabled,
        queryKey: ["fieldParcels", cropFieldId],
        queryFn: () => getFieldParcelsOfVersion(cropFieldId),
        refetchOnWindowFocus: false,
    });
}