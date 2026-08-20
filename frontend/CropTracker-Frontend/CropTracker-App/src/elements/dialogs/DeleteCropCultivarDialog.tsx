import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface DeleteCropCultivarDialogProps {
  dialogOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

function DeleteCropCultivarDialog({
  dialogOpen,
  onCancel,
  onConfirm,
  isPending,
}: DeleteCropCultivarDialogProps) {
  return (
    <Box>
      <Dialog open={dialogOpen} onClose={onCancel}>
        <DialogTitle sx={{ position: "relative", display: "flex" }}>
          <Typography sx={{ fontWeight: "bold", letterSpacing: "0.05rem" }}>
            Delete Crop Specie
          </Typography>
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={onCancel}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Typography>
            Are you sure you want to remove this crop specie?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button disabled={isPending} onClick={onCancel} color="error">
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={onConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DeleteCropCultivarDialog;
