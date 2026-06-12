import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

interface InvalidAuthTokenDialogProps {
  onConfirm: () => void;
  onConfirmCancel: () => void;
  open: boolean;
}

function InvalidAuthTokenDialog({
  onConfirm,
  onConfirmCancel,
  open,
}: InvalidAuthTokenDialogProps) {
  return (
    <Box>
      <Dialog open={open} onClose={onConfirmCancel}>
        <DialogTitle>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <WarningAmberIcon color="warning" />
            <Typography variant="h6" component={"span"} fontWeight={"bold"}>
              Invalid or Expired Session Token
            </Typography>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText color="text.secondary">
            Your security session has timed out or is no longer valid. For your
            protection, please log back into the application to continue
            managing your crop fields.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onConfirmCancel} color="error">
            Cancel
          </Button>
          <Button onClick={onConfirm} sx={{ color: "text.secondary" }}>
            Back to Login
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default InvalidAuthTokenDialog;
