import { useQuery } from "@tanstack/react-query";
import { getFieldParcells } from "../../services/FieldParcelService";

export const useFieldParcels = (cropFieldId: string, enabled: boolean) => {
    return useQuery({
        enabled: enabled,
        queryKey: ["fieldParcels", cropFieldId],
        queryFn: () => getFieldParcells(cropFieldId),
        refetchOnWindowFocus: false,
    });
}