import CloseIcon from "@mui/icons-material/Close";
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

interface DeleteFieldWorkDialogProps {
  onConfirmDelete: () => void;
  onConfirmCancel: () => void;
  open: boolean;
}

function DeleteFieldWorkDialog({
  onConfirmDelete,
  onConfirmCancel,
  open,
}: DeleteFieldWorkDialogProps) {
  return (
    <Box>
      <Dialog open={open} onClose={onConfirmCancel}>
        <DialogTitle sx={{ position: "relative", display: "flex" }}>
          <Typography fontWeight="bold">Delete Field Work</Typography>
          <IconButton
            onClick={onConfirmCancel}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Typography>
            Are you sure you want to delete this field work?
          </Typography>
        </DialogContent>
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

export default DeleteFieldWorkDialog;
