import { TreeItem } from "@mui/x-tree-view";
import { useCropsStore } from "../../hooks/UseCropsStore";
import type { GetCropSpecieDTO } from "../../interfaces/response/GetCropSpecieDTO";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import CultivarItem from "./CultivarItem";
import type { GetCropCultivarDTO } from "../../interfaces/response/GetCropCultivarDTO";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
import { useState } from "react";
import AddCropCultivarForm from "../forms/AddCropCultivarForm";
import type { CreateCropCultivarDTO } from "../../interfaces/request/CreateCropCultivarDTO";
import DeleteCropSpecieDialog from "../dialogs/DeleteCropSpecieDialog";
import type { UpdateCropSpecieDTO } from "../../interfaces/request/UpdateCropSpecieDTO";
import UpdateCropSpecieForm from "../forms/UpdateCropSpecieForm";
import { useMutation } from "@tanstack/react-query";
import {
  deleteCropSpecie,
  updateCropSpecie,
} from "../../services/CropSpecieService";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "../../interfaces/ErrorResponse";
import { createCropCultivar } from "../../services/CropCultivarService";

interface SpecieItemProps {
  specie: GetCropSpecieDTO;
  onOperationSuccess: (message: string) => void;
}

function SpecieItem({ specie, onOperationSuccess }: SpecieItemProps) {
  const emptyCultivarsList = [] as GetCropCultivarDTO[];

  const [addCultivarOpen, setAddCultivarOpen] = useState<boolean>(false);
  const [deleteSpecieOpen, setDeleteSpecieOpen] = useState<boolean>(false);
  const [updateSpecieOpen, setUpdateSpecieOpen] = useState<boolean>(false);
  const [selectedSpecie, setSelectedSpecie] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const cultivars = useCropsStore(
    (s) => s.cultivars[specie.uid] || emptyCultivarsList,
  );
  const loading = useCropsStore((s) => s.loading[specie.uid]);
  const fetchCultivars = useCropsStore((s) => s.fetchCultivars);
  const addNewCultivar = useCropsStore((s) => s.addCultivars);
  const deleteSpecie = useCropsStore((s) => s.deleteSpecies);
  const updateSpecie = useCropsStore((s) => s.updateSpecies);

  const handleClick = () => {
    fetchCultivars(specie.uid);
  };

  const handleAddCultivarSetup = (
    event: React.MouseEvent<HTMLButtonElement>,
    specieId: string,
  ) => {
    event.stopPropagation();
    setAddCultivarOpen(true);
    setSelectedSpecie(specieId);
  };

  const handleUpdateSpecieSetup = (
    event: React.MouseEvent<HTMLButtonElement>,
    specieId: string,
  ) => {
    event.stopPropagation();
    setUpdateSpecieOpen(true);
    setSelectedSpecie(specieId);
  };

  const handleAddCultivarClose = () => {
    setAddCultivarOpen(false);
    setErrorMessage("");
    setSelectedSpecie("");
  };

  const handleUpdateSpecieClose = () => {
    setUpdateSpecieOpen(false);
    setErrorMessage("");
    setSelectedSpecie("");
  };

  const { mutate: updateSpecieMutate, isPending: isUpdateSpeciePending } =
    useMutation({
      mutationFn: ({
        cropSpecieUpdates,
        specieId,
      }: {
        cropSpecieUpdates: UpdateCropSpecieDTO;
        specieId: string;
      }) => updateCropSpecie(cropSpecieUpdates, specieId),
      onSuccess: (updatedCropSpecie: GetCropSpecieDTO) => {
        updateSpecie(updatedCropSpecie);
        setErrorMessage("");
        setUpdateSpecieOpen(false);
        setSelectedSpecie("");
        onOperationSuccess("Crop specie has been successfully updated.");
      },
      onError: (error: AxiosError) => {
        if (error.response?.status === 400) {
          const message = (error.response.data as ErrorResponse).message;
          setErrorMessage(message || "");
        }
      },
    });

  const { mutate: createCultivarMutate, isPending: isAddCultivarPending } =
    useMutation({
      mutationFn: createCropCultivar,
      onSuccess: (response: GetCropCultivarDTO) => {
        addNewCultivar(response);
        setErrorMessage("");
        setAddCultivarOpen(false);
        setSelectedSpecie("");
        onOperationSuccess("New crop cultivar has been successfully added.");
      },
      onError: (error: AxiosError) => {
        if (error.response?.status === 400) {
          const message = (error.response.data as ErrorResponse).message;
          setErrorMessage(message || "");
        }
      },
    });

  const { mutate: deleteSpecieMutate, isPending: isDeleteSpeciePending } =
    useMutation({
      mutationFn: deleteCropSpecie,
      onSuccess: () => {
        deleteSpecie(specie);
        setDeleteSpecieOpen(false);
        onOperationSuccess("Crop specie has been successfully deleted.");
      },
    });

  const addCultivar = async (newCropCultivar: CreateCropCultivarDTO) => {
    createCultivarMutate(newCropCultivar);
  };

  const handleUpdateSpecie = async (cropSpecieUpdates: UpdateCropSpecieDTO) => {
    updateSpecieMutate({ cropSpecieUpdates, specieId: specie.uid });
  };

  const handleDeleteSpecieSetup = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    setDeleteSpecieOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteSpecieOpen(false);
  };

  const handleDelete = async () => {
    deleteSpecieMutate(specie.uid);
    setDeleteSpecieOpen(false);
  };

  return (
    <Box>
      <TreeItem
        itemId={specie.uid}
        label={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              {specie.commonName}
            </Typography>
            <Box sx={{ display: "flex" }}>
              <IconButton
                onClick={(event) => handleAddCultivarSetup(event, specie.uid)}
              >
                <AddIcon />
              </IconButton>
              <IconButton onClick={(event) => handleDeleteSpecieSetup(event)}>
                <DeleteIcon />
              </IconButton>
              <IconButton
                onClick={(event) => handleUpdateSpecieSetup(event, specie.uid)}
              >
                <UpdateIcon />
              </IconButton>
            </Box>
          </Box>
        }
        onClick={handleClick}
      >
        {loading ? (
          <TreeItem
            itemId={`${specie.uid}-load`}
            label={<CircularProgress size={16} />}
          />
        ) : (
          cultivars.map((cultivar) => (
            <CultivarItem
              key={cultivar.uid}
              cultivar={cultivar}
              onOperationSuccess={onOperationSuccess}
            />
          ))
        )}
      </TreeItem>
      {addCultivarOpen && (
        <AddCropCultivarForm
          open={addCultivarOpen}
          specieId={selectedSpecie}
          onSubmit={addCultivar}
          onClose={handleAddCultivarClose}
          errorMessage={errorMessage}
          isPending={isAddCultivarPending}
        />
      )}
      {deleteSpecieOpen && (
        <DeleteCropSpecieDialog
          dialogOpen={deleteSpecieOpen}
          onDelete={handleDelete}
          onCancel={handleDeleteCancel}
          isPending={isDeleteSpeciePending}
        />
      )}
      {updateSpecieOpen && (
        <UpdateCropSpecieForm
          open={updateSpecieOpen}
          cropSpecie={specie}
          onSubmit={handleUpdateSpecie}
          onClose={handleUpdateSpecieClose}
          errorMessage={errorMessage}
          isPending={isUpdateSpeciePending}
        />
      )}
    </Box>
  );
}

export default SpecieItem;
