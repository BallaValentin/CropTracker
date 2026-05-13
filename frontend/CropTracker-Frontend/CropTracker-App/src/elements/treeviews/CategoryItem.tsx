import { TreeItem } from "@mui/x-tree-view";
import { useCropsStore } from "../../hooks/UseCropsStore";
import { CircularProgress } from "@mui/material";
import type { GetCropCategoryDTO } from "../../interfaces/response/GetCropCategoryDTO";
import SpecieItem from "./SpecieItem";
import type { GetCropSpecieDTO } from "../../interfaces/response/GetCropSpecieDTO";

function CategoryItem(category: GetCropCategoryDTO) {
  const emptySpeciesList = [] as GetCropSpecieDTO[];
  const species = useCropsStore(
    (s) => s.species[category.uid] || emptySpeciesList,
  );
  const loading = useCropsStore((s) => s.loading[category.uid]);
  const fetchSpecies = useCropsStore((s) => s.fetchSpecies);

  const handleClick = () => {
    console.log("CLICK");
    fetchSpecies(category.uid);
  };

  return (
    <TreeItem
      itemId={category.uid}
      label={category.categoryName}
      onClick={handleClick}
    >
      {loading ? (
        <TreeItem
          itemId={`${category.uid}-load`}
          label={<CircularProgress size={16} />}
        />
      ) : (
        species.map((specie) => <SpecieItem key={specie.uid} {...specie} />)
      )}
    </TreeItem>
  );
}

export default CategoryItem;
