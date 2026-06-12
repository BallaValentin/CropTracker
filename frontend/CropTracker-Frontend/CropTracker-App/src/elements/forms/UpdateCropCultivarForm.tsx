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
import type { UpdateCropCultivarDTO } from "../../interfaces/request/UpdateCropCultivarDTO";
import type { GetCropCultivarDTO } from "../../interfaces/response/GetCropCultivarDTO";

interface UpdateCropCultivarProps {
  open: boolean;
  cultivar: GetCropCultivarDTO;
  onSubmit: (cropCultivarUpdates: UpdateCropCultivarDTO) => void;
  onClose: () => void;
}

function UpdateCropCultivarForm({
  open,
  cultivar,
  onSubmit,
  onClose,
}: UpdateCropCultivarProps) {
  const [cropCultivarUpdates, setCropCultivarUpdates] =
    useState<UpdateCropCultivarDTO>({
      cultivarName: cultivar.cultivarName,
      specieId: cultivar.specieId,
      droughtTolerance: cultivar.droughtTolerance,
      daysToMaturity: cultivar.daysToMaturity,
      idealPhRange: cultivar.idealPhRange,
    });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(cropCultivarUpdates);
  };

  const handleCancel = () => {
    setCropCultivarUpdates({
      cultivarName: "",
      specieId: "",
      droughtTolerance: 0,
      daysToMaturity: 0,
      idealPhRange: 0,
    });
    onClose();
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCropCultivarUpdates((prev) => ({
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
            Add crop cultivar
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                color="success"
                value={cropCultivarUpdates.cultivarName}
                name="cultivarName"
                label="Cultivar Name"
                required
                onChange={handleInput}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                type="number"
                value={cropCultivarUpdates.droughtTolerance}
                color="success"
                name="droughtTolerance"
                label="Dought Tolerance Level"
                onChange={handleInput}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                type="number"
                value={cropCultivarUpdates.daysToMaturity}
                color="success"
                name="daysToMaturity"
                label="Days to Maturity"
                onChange={handleInput}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                type="number"
                value={cropCultivarUpdates.idealPhRange}
                color="success"
                name="idealPhRange"
                label="Ideal Ph Range"
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

export default UpdateCropCultivarForm;
