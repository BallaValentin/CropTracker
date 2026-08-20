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
  const { t } = useTranslation();

  return (
    <Box>
      <Dialog open={open} onClose={onConfirmCancel} maxWidth="md">
        <DialogTitle sx={{ display: "flex", position: "relative", width: 600 }}>
          <Typography
            variant="h6"
            component={"span"}
            sx={{ fontWeight: "bold" }}
          >
            {t("elements.dialogs.deleteFieldParcelDialog.dialogTitle") ||
              "Delete Field Parcel"}
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
          <Typography>
            {t("elements.dialogs.deleteFieldParcelDialog.dialogContent") ||
              "Are you sure you want to delete this field parcel?"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onConfirmCancel} color="primary">
            {t("elements.dialogs.deleteFieldParcelDialog.cancelButton") ||
              "Cancel"}
          </Button>
          <Button onClick={onConfirmDelete} color="error">
            {t("elements.dialogs.deleteFieldParcelDialog.deleteButton") ||
              "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DeleteFieldParcelDialog;
