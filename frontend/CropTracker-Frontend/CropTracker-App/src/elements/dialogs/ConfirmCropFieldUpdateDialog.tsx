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
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

interface ConfirmCropFieldUpdateDialogProps {
  open: boolean;
  isPending: boolean;
  numberOfOngoing: number;
  numberOfScheduled: number;
  onConfirmCancel: () => void;
  onConfirmUpdate: () => void;
}

function ConfirmCropFieldUpdateDialog({
  open,
  isPending,
  numberOfOngoing,
  numberOfScheduled,
  onConfirmCancel,
  onConfirmUpdate,
}: ConfirmCropFieldUpdateDialogProps) {
  const { t } = useTranslation();

  return (
    <Box>
      <Dialog open={open} onClose={onConfirmCancel} maxWidth="md" fullWidth>
        <DialogTitle sx={{ position: "relative", display: "flex" }}>
          <Typography sx={{ fontWeight: "bold", letterSpacing: "0.05rem" }}>
            {t("elements.dialogs.confirmCropFieldUpdateDialog.dialogTitle", {
              defaultvalue: "Confirm Crop Field Update",
            })}
          </Typography>
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={onConfirmCancel}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t("elements.dialogs.confirmCropFieldUpdateDialog.dialogContent1", {
              defaultvalue: "Updating this field will affect your ",
            })}
            <strong>{numberOfOngoing}</strong>
            {t("elements.dialogs.confirmCropFieldUpdateDialog.dialogContent2", {
              defaultvalue: "ongoing and ",
            })}
            <strong>{numberOfScheduled}</strong>
            {t("elements.dialogs.confirmCropFieldUpdateDialog.dialogContent3", {
              defaultvalue: "scheduled work tasks.",
            })}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {t(
              "elements.dialogs.confirmCropFieldUpdateDialog.dialogContentLongText",
              {
                defaultvalue:
                  "By pressing confirm, the scheduled works will automatically use the new layout, but the ongoing works will stay locked to the current layout.",
              },
            )}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {t("elements.dialogs.confirmCropFieldUpdateDialog.dialogQuery", {
              defaultvalue: "Do you want to proceed with this update?",
            })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onConfirmCancel} color="error" disabled={isPending}>
            {t("elements.dialogs.confirmCropFieldUpdateDialog.cancelButton", {
              defaultvalue: "Cancel",
            })}
          </Button>
          <Button
            onClick={onConfirmUpdate}
            color="success"
            variant="contained"
            disabled={isPending}
          >
            {t("elements.dialogs.confirmCropFieldUpdateDialog.updateButton", {
              defaultvalue: "Update",
            })}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ConfirmCropFieldUpdateDialog;
