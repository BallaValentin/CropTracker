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
import type { CreateCropCultivarDTO } from "../../interfaces/request/CreateCropCultivarDTO";

interface AddCropSpecieProps {
  open: boolean;
  specieId: string;
  onSubmit: (newCropCultivar: CreateCropCultivarDTO) => void;
  onClose: () => void;
}

function AddCropCultivarForm({
  open,
  specieId,
  onSubmit,
  onClose,
}: AddCropSpecieProps) {
  const [newCropCultivar, setNewCropCultivar] = useState<CreateCropCultivarDTO>(
    {
      cultivarName: "",
      specieId: specieId,
      droughtTolerance: 1,
      daysToMaturity: 0,
      idealPhRange: 4.0,
    },
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(newCropCultivar);
  };

  const handleCancel = () => {
    setNewCropCultivar({
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
    setNewCropCultivar((prev) => ({
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
                value={newCropCultivar.droughtTolerance}
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
                value={newCropCultivar.daysToMaturity}
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
                value={newCropCultivar.idealPhRange}
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

export default AddCropCultivarForm;
