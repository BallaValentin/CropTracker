import { useQuery } from "@tanstack/react-query";
import { getCropCultivarsWithPattern } from "../../services/CropCultivarService";

export const useCropSearch = (pattern: string) => {
    return useQuery({
        queryKey: ["crops", pattern],
        queryFn: () => getCropCultivarsWithPattern(pattern),
        staleTime: 1000 * 60 * 60,
    });
}