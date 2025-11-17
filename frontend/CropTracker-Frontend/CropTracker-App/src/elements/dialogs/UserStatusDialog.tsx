import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import type { AdminUser } from "../../interfaces/AdminUser";

interface UserStatusDialogProps {
  isPending: boolean;
  title: string;
  contentText: string;
  actionText: string;
  open: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onAccept: (user: AdminUser) => void;
}

function UserStatusDialog({
  isPending,
  title,
  contentText,
  actionText,
  open,
  onClose,
  user,
  onAccept,
}: UserStatusDialogProps) {
  if (user === null) {
    return null;
  }

  return (
    <>
      <Box>
        <Dialog
          open={open}
          onClose={onClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{contentText}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button disabled={isPending} onClick={() => onAccept(user)}>
              {actionText}
            </Button>
            <Button disabled={isPending} onClick={onClose}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}

export default UserStatusDialog;
