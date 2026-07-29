import { enqueueSnackbar, closeSnackbar } from "notistack";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

export const addSnackbar = (message: string) => {
  enqueueSnackbar(message, {
    action: (key) => (
      <IconButton
        size="small"
        color="inherit"
        onClick={() => closeSnackbar(key)}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    ),
  });
};
