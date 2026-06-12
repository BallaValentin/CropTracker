import { Box, Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

interface DeleteCropFieldDialogProps {
  onConfirmDelete: () => void;
  onConfirmCancel: () => void;
  open: boolean;
}

function DeleteCropFieldDialog({
  onConfirmDelete,
  onConfirmCancel,
  open,
}: DeleteCropFieldDialogProps) {
  return (
    <Box>
      <Dialog open={open} onClose={onConfirmCancel}>
        <DialogTitle>
          Are you sure you want to delete this crop field?
        </DialogTitle>
        <DialogActions>
          <Button onClick={onConfirmCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={onConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DeleteCropFieldDialog;
