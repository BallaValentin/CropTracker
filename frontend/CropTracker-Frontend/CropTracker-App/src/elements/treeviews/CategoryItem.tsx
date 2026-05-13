import { TreeItem } from "@mui/x-tree-view";
import { useCropsStore } from "../../hooks/UseCropsStore";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import type { GetCropCategoryDTO } from "../../interfaces/response/GetCropCategoryDTO";
import SpecieItem from "./SpecieItem";
import type { GetCropSpecieDTO } from "../../interfaces/response/GetCropSpecieDTO";
import AddIcon from "@mui/icons-material/Add";
import AddCropSpecieForm from "../forms/AddCropSpecieForm";
import type { CreateCropSpecieDTO } from "../../interfaces/request/CreateCropSpecieDTO";
import { useState } from "react";

function CategoryItem(category: GetCropCategoryDTO) {
  const emptySpeciesList = [] as GetCropSpecieDTO[];
  const [addSpecieOpen, setAddSpecieOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const species = useCropsStore(
    (s) => s.species[category.uid] || emptySpeciesList,
  );
  const loading = useCropsStore((s) => s.loading[category.uid]);
  const fetchSpecies = useCropsStore((s) => s.fetchSpecies);
  const addNewSpecie = useCropsStore((s) => s.addSpecies);

  const handleClick = () => {
    fetchSpecies(category.uid);
  };

  const handleAddSpecieSetup = (
    event: React.MouseEvent<HTMLButtonElement>,
    categoryId: string,
  ) => {
    event.stopPropagation();
    setSelectedCategory(categoryId);
    setAddSpecieOpen(true);
  };

  const handleDialogClose = () => {
    setAddSpecieOpen(false);
  };

  const addSpecie = async (newCropSpecie: CreateCropSpecieDTO) => {
    await addNewSpecie(newCropSpecie);
    setAddSpecieOpen(false);
    setSelectedCategory("");
  };

  return (
    <Box>
      <TreeItem
        itemId={category.uid}
        label={
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography
              variant="h6"
              component={"h6"}
              fontSize={"large"}
              sx={{ fontWeight: "bold" }}
            >
              {category.categoryName}
            </Typography>
            <IconButton
              onClick={(event) => handleAddSpecieSetup(event, category.uid)}
            >
              <AddIcon />
            </IconButton>
          </Box>
        }
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
      {addSpecieOpen && (
        <AddCropSpecieForm
          open={addSpecieOpen}
          categoryId={selectedCategory}
          onSubmit={addSpecie}
          onClose={handleDialogClose}
        />
      )}
    </Box>
  );
}

export default CategoryItem;
