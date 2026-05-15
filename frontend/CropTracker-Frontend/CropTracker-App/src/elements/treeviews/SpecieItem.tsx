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

function SpecieItem(specie: GetCropSpecieDTO) {
  const emptyCultivarsList = [] as GetCropCultivarDTO[];

  const [addCultivarOpen, setAddCultivarOpen] = useState<boolean>(false);
  const [deleteSpecieOpen, setDeleteSpecieOpen] = useState<boolean>(false);
  const [updateSpecieOpen, setUpdateSpecieOpen] = useState<boolean>(false);
  const [selectedSpecie, setSelectedSpecie] = useState<string>("");

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
    setSelectedSpecie("");
  };

  const handleUpdateSpecieClose = () => {
    setUpdateSpecieOpen(false);
    setSelectedSpecie("");
  };

  const addCultivar = async (newCropCultivar: CreateCropCultivarDTO) => {
    await addNewCultivar(newCropCultivar);
    setAddCultivarOpen(false);
    setSelectedSpecie("");
  };

  const handleUpdateSpecie = async (cropSpecieUpdates: UpdateCropSpecieDTO) => {
    await updateSpecie(cropSpecieUpdates, specie.uid);
    setUpdateSpecieOpen(false);
    setSelectedSpecie("");
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
    await deleteSpecie(specie);
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
            <CultivarItem key={cultivar.uid} {...cultivar} />
          ))
        )}
      </TreeItem>
      {addCultivarOpen && (
        <AddCropCultivarForm
          open={addCultivarOpen}
          specieId={selectedSpecie}
          onSubmit={addCultivar}
          onClose={handleAddCultivarClose}
        />
      )}
      {deleteSpecieOpen && (
        <DeleteCropSpecieDialog
          dialogOpen={deleteSpecieOpen}
          onDelete={handleDelete}
          onCancel={handleDeleteCancel}
        />
      )}
      {updateSpecieOpen && (
        <UpdateCropSpecieForm
          open={updateSpecieOpen}
          cropSpecie={specie}
          onSubmit={handleUpdateSpecie}
          onClose={handleUpdateSpecieClose}
        />
      )}
    </Box>
  );
}

export default SpecieItem;
