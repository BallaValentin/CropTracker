import { SimpleTreeView } from "@mui/x-tree-view";
import { useCropsStore } from "../../hooks/caching/UseCropsStore";
import CategoryItem from "./CategoryItem";
import { useEffect } from "react";
import type { GetCropCategoryDTO } from "../../interfaces/response/GetCropCategoryDTO";

interface CropsTreeViewProps {
  cropCategories: GetCropCategoryDTO[];
  onOperationSuccess: (message: string) => void;
}

function CropsTreeView({
  cropCategories,
  onOperationSuccess,
}: CropsTreeViewProps) {
  const categories = useCropsStore((s) => s.categories);
  const setCategories = useCropsStore((s) => s.setCategories);

  useEffect(() => {
    setCategories(cropCategories);
  }, [setCategories, cropCategories]);

  return (
    <SimpleTreeView>
      {categories.map((category) => (
        <CategoryItem
          key={category.uid}
          category={category}
          onOperationSuccess={onOperationSuccess}
        />
      ))}
    </SimpleTreeView>
  );
}

export default CropsTreeView;
