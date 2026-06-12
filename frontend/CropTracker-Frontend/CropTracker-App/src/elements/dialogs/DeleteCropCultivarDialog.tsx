import { Box, Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

interface DeleteCropCultivarDialogProps {
  dialogOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function DeleteCropCultivarDialog({
  dialogOpen,
  onCancel,
  onConfirm,
}: DeleteCropCultivarDialogProps) {
  return (
    <Box>
      <Dialog open={dialogOpen} onClose={onCancel}>
        <DialogTitle>
          Are you sure you want to remove this crop specie?
        </DialogTitle>
        <DialogActions>
          <Button onClick={onCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={onConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DeleteCropCultivarDialog;
