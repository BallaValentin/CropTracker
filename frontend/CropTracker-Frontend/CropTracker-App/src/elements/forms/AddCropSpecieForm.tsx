import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import type { CreateCropSpecieDTO } from "../../interfaces/request/CreateCropSpecieDTO";
import { useState } from "react";

interface AddCropSpecieProps {
  open: boolean;
  categoryId: string;
  onSubmit: (newCropSpecie: CreateCropSpecieDTO) => void;
  onClose: () => void;
}

function AddCropSpecieForm({
  open,
  categoryId,
  onSubmit,
  onClose,
}: AddCropSpecieProps) {
  const [newCropSpecie, setNewCropSpecie] = useState<CreateCropSpecieDTO>({
    commonName: "",
    scientificName: null,
    categoryId: categoryId,
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newCropSpecie.scientificName) {
      setNewCropSpecie((prev) => ({
        ...prev,
        scientificName: null,
      }));
    }
    onSubmit(newCropSpecie);
  };

  const handleCancel = () => {
    setNewCropSpecie({
      commonName: "",
      scientificName: "",
      categoryId: "",
    });
    onClose();
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewCropSpecie((prev) => ({
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
            Add crop specie
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

export default AddCropSpecieForm;
