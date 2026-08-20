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
import { useTranslation } from "react-i18next";

interface DeleteCropFieldDialogProps {
  onConfirmDelete: () => void;
  onConfirmCancel: () => void;
  open: boolean;
}

function DeleteCropFieldDialog({
  onConfirmDelete,
  onConfirmCancel,
  open,
}: DeleteCropFieldDialogProps) {
  const { t } = useTranslation();

  return (
    <Box>
      <Dialog open={open} onClose={onConfirmCancel} maxWidth="md">
        <DialogTitle sx={{ display: "flex", width: 600, position: "relative" }}>
          <Typography
            variant="h6"
            component={"span"}
            sx={{ fontWeight: "bold" }}
          >
            {t("elements.dialogs.deleteCropFieldDialog.dialogTitle") ||
              "Delete Crop Field"}
          </Typography>
          <IconButton
            onClick={onConfirmCancel}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Typography>
            {t("elements.dialogs.deleteCropFieldDialog.dialogContent") ||
              "Are you sure you want to delete this crop field?"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onConfirmCancel} color="primary">
            {t("elements.dialogs.deleteCropFieldDialog.cancelButton") ||
              "Cancel"}
          </Button>
          <Button onClick={onConfirmDelete} color="error">
            {t("elements.dialogs.deleteCropFieldDialog.deleteButton") ||
              "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DeleteCropFieldDialog;
