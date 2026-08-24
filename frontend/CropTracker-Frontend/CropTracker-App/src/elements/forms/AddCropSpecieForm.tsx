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
import type { CreateCropSpecieDTO } from "../../interfaces/request/CreateCropSpecieDTO";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

interface AddCropSpecieProps {
  open: boolean;
  categoryId: string;
  onSubmit: (newCropSpecie: CreateCropSpecieDTO) => void;
  onClose: () => void;
  errorMessage: string;
  isPending: boolean;
}

function AddCropSpecieForm({
  open,
  categoryId,
  onSubmit,
  onClose,
  errorMessage,
  isPending,
}: AddCropSpecieProps) {
  const [newCropSpecie, setNewCropSpecie] = useState<CreateCropSpecieDTO>({
    commonName: "",
    hungarianName: "",
    romanianName: "",
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
      romanianName: "",
      hungarianName: "",
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
      <DialogTitle sx={{ display: "flex", position: "relative" }}>
        <Typography sx={{ fontWeight: "bold", letterSpacing: "0.05rem" }}>
          Add crop specie
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
                name="hungarianName"
                label="Hungarian Name"
                onChange={handleInput}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                color="success"
                name="romanianName"
                label="Romanian Name"
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

export default AddCropSpecieForm;
