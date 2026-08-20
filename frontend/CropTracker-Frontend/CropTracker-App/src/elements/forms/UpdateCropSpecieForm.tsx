import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { UpdateCropSpecieDTO } from "../../interfaces/request/UpdateCropSpecieDTO";
import type { GetCropSpecieDTO } from "../../interfaces/response/GetCropSpecieDTO";
import CloseIcon from "@mui/icons-material/Close";

interface UpdateCropSpecieProps {
  open: boolean;
  onSubmit: (cropSpecieUpdates: UpdateCropSpecieDTO) => void;
  cropSpecie: GetCropSpecieDTO;
  onClose: () => void;
  errorMessage: string;
  isPending: boolean;
}

function UpdateCropSpecieForm({
  open,
  cropSpecie,
  onSubmit,
  onClose,
  errorMessage,
  isPending,
}: UpdateCropSpecieProps) {
  const [cropSpecieUpdates, setCropSpecieUpdates] =
    useState<UpdateCropSpecieDTO>({
      commonName: cropSpecie.commonName,
      scientificName: cropSpecie.scientificName,
      categoryId: cropSpecie.categoryId,
    });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!cropSpecieUpdates.scientificName) {
      setCropSpecieUpdates((prev) => ({
        ...prev,
        scientificName: null,
      }));
    }
    onSubmit(cropSpecieUpdates);
  };

  const handleCancel = () => {
    setCropSpecieUpdates({
      commonName: "",
      scientificName: "",
      categoryId: "",
    });
    onClose();
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCropSpecieUpdates((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle
        sx={{ position: "relative", display: "flex", top: 8, right: 8 }}
      >
        <Typography sx={{ fontWeight: "bold", letterSpacing: "0.05rem" }}>
          Update crop specie
        </Typography>
        <IconButton sx={{ position: "absolute", top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                color="success"
                name="commonName"
                label="Common Name"
                value={cropSpecieUpdates.commonName}
                required
                onChange={handleInput}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                color="success"
                name="scientificName"
                label="Scientific Name"
                value={cropSpecieUpdates.scientificName}
                onChange={handleInput}
                fullWidth
              />
            </Grid>
          </Grid>

          <Typography
            variant="subtitle2"
            color="error"
            sx={{ my: 1, textAlign: "center" }}
          >
            {errorMessage}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button disabled={isPending} color="success" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            disabled={isPending}
            type="submit"
            variant="contained"
            color="success"
          >
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default UpdateCropSpecieForm;
