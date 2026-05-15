import { Box, Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

interface DeleteSpecieDialogProps {
  dialogOpen: boolean;
  onDelete: () => void;
  onCancel: () => void;
}

function DeleteCropSpecieDialog({
  dialogOpen,
  onDelete,
  onCancel,
}: DeleteSpecieDialogProps) {
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
          <Button onClick={onDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DeleteCropSpecieDialog;
