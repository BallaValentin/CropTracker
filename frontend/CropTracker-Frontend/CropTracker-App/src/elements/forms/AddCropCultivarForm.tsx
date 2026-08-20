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
import type { CreateCropCultivarDTO } from "../../interfaces/request/CreateCropCultivarDTO";
import CloseIcon from "@mui/icons-material/Close";

interface AddCropSpecieProps {
  open: boolean;
  specieId: string;
  onSubmit: (newCropCultivar: CreateCropCultivarDTO) => void;
  onClose: () => void;
  errorMessage: string;
  isPending: boolean;
}

function AddCropCultivarForm({
  open,
  specieId,
  onSubmit,
  onClose,
  errorMessage,
  isPending,
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
      <DialogTitle sx={{ position: "relative", display: "flex" }}>
        <Typography sx={{ fontWeight: "bold", letterSpacing: "0.05rem" }}>
          Add crop cultivar
        </Typography>

        <IconButton
          sx={{ position: "absolute", top: 8, right: 8 }}
          onClick={onClose}
        >
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

export default AddCropCultivarForm;
