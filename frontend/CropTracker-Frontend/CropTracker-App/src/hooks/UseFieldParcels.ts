import { useQuery } from "@tanstack/react-query";
import { getFieldParcells } from "../services/FieldParcelService";

export const useFieldParcels = (cropFieldId: string) => {
    return useQuery({
        queryKey: ["fieldParcels", cropFieldId],
        queryFn: () => getFieldParcells(cropFieldId),
        refetchOnWindowFocus: false,
    });
}