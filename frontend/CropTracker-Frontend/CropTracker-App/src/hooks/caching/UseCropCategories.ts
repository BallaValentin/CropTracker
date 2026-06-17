import { useQuery } from "@tanstack/react-query";
import { getCropCategories } from "../../services/CropCategoryService";

export const useCropCategories = () => {
    return useQuery({
        queryKey: ["crops-categories"],
        queryFn: getCropCategories,
        staleTime: 1000 * 60 * 60,
    });
}