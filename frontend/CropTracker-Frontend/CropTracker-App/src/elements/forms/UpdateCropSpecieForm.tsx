import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { UpdateCropSpecieDTO } from "../../interfaces/request/UpdateCropSpecieDTO";
import type { GetCropSpecieDTO } from "../../interfaces/response/GetCropSpecieDTO";

interface UpdateCropSpecieProps {
  open: boolean;
  onSubmit: (cropSpecieUpdates: UpdateCropSpecieDTO) => void;
  cropSpecie: GetCropSpecieDTO;
  onClose: () => void;
}

function UpdateCropSpecieForm({
  open,
  cropSpecie,
  onSubmit,
  onClose,
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
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography
            variant="h6"
            fontSize={"large"}
            sx={{ mb: 4, fontWeight: "bold", letterSpacing: "0.05rem" }}
          >
            Update crop specie
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                color="success"
                name="commonName"
                label="Common Name"
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
                onChange={handleInput}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button color="success" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="success">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default UpdateCropSpecieForm;
