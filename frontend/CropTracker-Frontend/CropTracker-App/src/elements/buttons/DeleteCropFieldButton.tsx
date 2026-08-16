import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface DeleteCropFieldButtonProps {
  onDeleteButtonClicked: () => void;
}

function DeleteCropFieldButton({
  onDeleteButtonClicked,
}: DeleteCropFieldButtonProps) {
  const { t } = useTranslation();

  const [deleteButtonHovered, setDeleteButtonHovered] = useState(false);
  return (
    <Box
      onMouseEnter={() => setDeleteButtonHovered(true)}
      onMouseLeave={() => setDeleteButtonHovered(false)}
      sx={{ display: "flex", alignItems: "center" }}
    >
      <Box
        sx={{
          height: 40,
          display: "flex",
          alignItems: "center",
          bgcolor: "error.light",
          color: "error.contrastText",
          borderRadius: "20px 0 0 20px",
          pr: "24px",
          pl: deleteButtonHovered ? 2 : 0,
          maxWidth: deleteButtonHovered ? 150 : 0,
          opacity: deleteButtonHovered ? 1 : 0,
          transition: "all 0.25s ease-in-out",
          overflow: "hidden",
          whiteSpace: "nowrap",
          mr: -2.5,
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: "bold", px: 1 }}>
          {t("elements.buttons.deleteCropFieldButton") || "Delete Crop Field"}
        </Typography>
      </Box>
      <IconButton
        color="error"
        sx={{
          bgcolor: "error.main",
          color: "error.contrastText",
          "&:hover": { bgcolor: "error.dark" },
        }}
        onClick={onDeleteButtonClicked}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}

export default DeleteCropFieldButton;
