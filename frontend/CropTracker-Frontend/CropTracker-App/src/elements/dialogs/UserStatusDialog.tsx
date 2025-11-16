import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import type { UserStatusUpdate } from "../../interfaces/UserStatusUpdate";

interface UserStatusDialogProps {
  isPending: boolean;
  title: string;
  contentText: string;
  actionText: string;
  open: boolean;
  onClose: () => void;
  userStatusUpdate: UserStatusUpdate;
  onAccept: (userStatusUpdate: UserStatusUpdate) => void;
}

function UserStatusDialog({
  userStatusUpdate,
  isPending,
  title,
  contentText,
  actionText,
  open,
  onClose,
  onAccept,
}: UserStatusDialogProps) {
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
            <Button
              disabled={isPending}
              onClick={() => onAccept(userStatusUpdate)}
            >
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
