import { useQuery } from "@tanstack/react-query";
import { getCropCultivarsWithPattern } from "../../services/CropCultivarService";

export const useCropSearch = (pattern: string, language: string) => {
    return useQuery({
        queryKey: ["crops", pattern, language],
        queryFn: () => getCropCultivarsWithPattern(pattern, language),
        staleTime: 1000 * 60 * 60,
    });
}