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
  isPending: boolean;
  open: boolean;
}

function DeleteFieldWorkDialog({
  onConfirmDelete,
  onConfirmCancel,
  isPending,
  open,
}: DeleteFieldWorkDialogProps) {
  return (
    <Box>
      <Dialog open={open} onClose={onConfirmCancel} maxWidth="md">
        <DialogTitle
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" component={"span"} fontWeight="bold">
            Confirm Delete Field Work
          </Typography>
          <IconButton
            disabled={isPending}
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
          <Button
            disabled={isPending}
            onClick={onConfirmCancel}
            color="primary"
          >
            Cancel
          </Button>
          <Button disabled={isPending} onClick={onConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DeleteFieldWorkDialog;
