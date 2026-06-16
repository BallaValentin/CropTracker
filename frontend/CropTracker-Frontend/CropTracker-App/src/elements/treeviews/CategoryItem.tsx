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
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "../../interfaces/ErrorResponse";
import { createCropSpecie } from "../../services/CropSpecieService";

interface CategoryItemProps {
  category: GetCropCategoryDTO;
  onOperationSuccess: (message: string) => void;
}

function CategoryItem({ category, onOperationSuccess }: CategoryItemProps) {
  const emptySpeciesList = [] as GetCropSpecieDTO[];
  const [addSpecieOpen, setAddSpecieOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

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

  const { mutate, isPending } = useMutation({
    mutationFn: createCropSpecie,
    onSuccess: (newCropSpecie: GetCropSpecieDTO) => {
      addNewSpecie(newCropSpecie);
      setErrorMessage("");
      setAddSpecieOpen(false);
      setSelectedCategory("");
      onOperationSuccess("New crop specie successfully added.");
    },
    onError: (error: AxiosError) => {
      console.log(error.response);
      if (error.response?.status === 400) {
        const message = (error.response.data as ErrorResponse).message;
        setErrorMessage(message || "");
      }
    },
  });

  const addSpecie = async (newCropSpecie: CreateCropSpecieDTO) => {
    mutate(newCropSpecie);
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
          species.map((specie) => (
            <SpecieItem
              key={specie.uid}
              specie={specie}
              onOperationSuccess={onOperationSuccess}
            />
          ))
        )}
      </TreeItem>
      {addSpecieOpen && (
        <AddCropSpecieForm
          open={addSpecieOpen}
          categoryId={selectedCategory}
          onSubmit={addSpecie}
          onClose={handleDialogClose}
          errorMessage={errorMessage}
          isPending={isPending}
        />
      )}
    </Box>
  );
}

export default CategoryItem;
