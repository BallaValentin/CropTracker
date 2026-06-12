import { TreeItem } from "@mui/x-tree-view";
import type { GetCropCultivarDTO } from "../../interfaces/response/GetCropCultivarDTO";
import { Box, IconButton, Typography } from "@mui/material";
import { useCropsStore } from "../../hooks/UseCropsStore";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteCropCultivarDialog from "../dialogs/DeleteCropCultivarDialog";
import { useState } from "react";
import type { UpdateCropCultivarDTO } from "../../interfaces/request/UpdateCropCultivarDTO";
import UpdateCropCultivarForm from "../forms/UpdateCropCultivarForm";

function CultivarItem(cultivar: GetCropCultivarDTO) {
  const [deleteCultivarOpen, setDeleteCultivarOpen] = useState<boolean>(false);
  const [updateCultivarOpen, setUpdateCultivarOpen] = useState<boolean>(false);
  const deleteCultivar = useCropsStore((s) => s.deleteCultivars);
  const updateCultivar = useCropsStore((s) => s.updateCultivars);

  const handleDeleteCultivarSetup = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    setDeleteCultivarOpen(true);
  };

  const handleDeleteCultivarClose = () => {
    setDeleteCultivarOpen(false);
  };

  const deleteCultivarConfirm = async () => {
    await deleteCultivar(cultivar);
    setDeleteCultivarOpen(false);
  };

  const handleUpdateCultivarSetup = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    setUpdateCultivarOpen(true);
  };

  const handleUpdateCultivarClose = () => {
    setUpdateCultivarOpen(false);
  };

  const handleCultivarUpdate = async (
    cultivarUpdates: UpdateCropCultivarDTO,
  ) => {
    await updateCultivar(cultivarUpdates, cultivar.uid);
    setUpdateCultivarOpen(false);
  };

  return (
    <Box>
      <TreeItem
        itemId={cultivar.uid}
        label={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography>{cultivar.cultivarName}</Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton onClick={(event) => handleDeleteCultivarSetup(event)}>
                <DeleteIcon />
              </IconButton>
              <IconButton onClick={(event) => handleUpdateCultivarSetup(event)}>
                <UpdateIcon />
              </IconButton>
            </Box>
          </Box>
        }
      />
      {deleteCultivarOpen && (
        <DeleteCropCultivarDialog
          dialogOpen={deleteCultivarOpen}
          onCancel={handleDeleteCultivarClose}
          onConfirm={deleteCultivarConfirm}
        />
      )}
      {updateCultivarOpen && (
        <UpdateCropCultivarForm
          open={updateCultivarOpen}
          cultivar={cultivar}
          onSubmit={handleCultivarUpdate}
          onClose={handleUpdateCultivarClose}
        />
      )}
    </Box>
  );
}

export default CultivarItem;
