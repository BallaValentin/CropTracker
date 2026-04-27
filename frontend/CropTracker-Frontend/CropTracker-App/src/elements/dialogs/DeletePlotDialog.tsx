import { Box, Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

interface DeletePlotDialogProps {
  onConfirmDelete: () => void;
  onConfirmCancel: () => void;
  open: boolean;
}

function DeletePlotDialog({
  onConfirmDelete,
  onConfirmCancel,
  open,
}: DeletePlotDialogProps) {
  return (
    <Box>
      <Dialog open={open} onClose={onConfirmCancel}>
        <DialogTitle>Are you sure you want to delete this plot?</DialogTitle>
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

export default DeletePlotDialog;
