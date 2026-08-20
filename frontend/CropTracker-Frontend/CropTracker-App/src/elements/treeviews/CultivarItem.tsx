import { TreeItem } from "@mui/x-tree-view";
import type { GetCropCultivarDTO } from "../../interfaces/response/GetCropCultivarDTO";
import { Box, IconButton, Typography } from "@mui/material";
import { useCropsStore } from "../../hooks/caching/UseCropsStore";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteCropCultivarDialog from "../dialogs/DeleteCropCultivarDialog";
import { useState } from "react";
import type { UpdateCropCultivarDTO } from "../../interfaces/request/UpdateCropCultivarDTO";
import UpdateCropCultivarForm from "../forms/UpdateCropCultivarForm";
import { useMutation } from "@tanstack/react-query";
import {
  deleteCropCultivar,
  updateCropCultivar,
} from "../../services/CropCultivarService";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "../../interfaces/error/ErrorResponse";

interface CultivarItemProps {
  cultivar: GetCropCultivarDTO;
  onOperationSuccess: (message: string) => void;
}

function CultivarItem({ cultivar, onOperationSuccess }: CultivarItemProps) {
  const [deleteCultivarOpen, setDeleteCultivarOpen] = useState<boolean>(false);
  const [updateCultivarOpen, setUpdateCultivarOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

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
    deleteCultivarMutate(cultivar.uid);
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

  const { mutate: updateCultivarMutate, isPending: isUpdateCultivarPending } =
    useMutation({
      mutationFn: ({
        cultivarUpdates,
        cultivarId,
      }: {
        cultivarUpdates: UpdateCropCultivarDTO;
        cultivarId: string;
      }) => updateCropCultivar(cultivarUpdates, cultivarId),
      onSuccess: (response: GetCropCultivarDTO) => {
        updateCultivar(response);
        setErrorMessage("");
        setUpdateCultivarOpen(false);
        onOperationSuccess("Crop cultivar has been successfully updated.");
      },
      onError: (error: AxiosError) => {
        if (error.response?.status === 400) {
          const message = (error.response.data as ErrorResponse).message;
          setErrorMessage(message || "");
        }
      },
    });

  const { mutate: deleteCultivarMutate, isPending: isDeleteCultivarPending } =
    useMutation({
      mutationFn: deleteCropCultivar,
      onSuccess: () => {
        deleteCultivar(cultivar);
        setDeleteCultivarOpen(false);
        onOperationSuccess("Crop cultivar has been successfully deleted.");
      },
    });

  const handleCultivarUpdate = (cultivarUpdates: UpdateCropCultivarDTO) => {
    updateCultivarMutate({ cultivarUpdates, cultivarId: cultivar.uid });
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
          isPending={isDeleteCultivarPending}
        />
      )}
      {updateCultivarOpen && (
        <UpdateCropCultivarForm
          open={updateCultivarOpen}
          cultivar={cultivar}
          onSubmit={handleCultivarUpdate}
          onClose={handleUpdateCultivarClose}
          errorMessage={errorMessage}
          isPending={isUpdateCultivarPending}
        />
      )}
    </Box>
  );
}

export default CultivarItem;
