import { Box, Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

interface DeleteFieldParcelDialogProps {
  onConfirmDelete: () => void;
  onConfirmCancel: () => void;
  open: boolean;
}

function DeleteFieldParcelDialog({
  onConfirmDelete,
  onConfirmCancel,
  open,
}: DeleteFieldParcelDialogProps) {
  return (
    <Box>
      <Dialog open={open} onClose={onConfirmCancel}>
        <DialogTitle>
          Are you sure you want to delete this field parcel?
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

export default DeleteFieldParcelDialog;
