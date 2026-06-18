import { Box, Button, Card, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { GetCropFieldDTO } from "../../interfaces/response/GetCropFieldDTO";
import MapPreview from "../../leaflet/view/MapPreview";
import DeleteCropFieldButton from "../buttons/DeleteCropFieldButton";
import DeleteCropFieldDialog from "../dialogs/DeleteCropFieldDialog";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { deleteCropFieldById } from "../../services/CropFieldService";
import { queryClient } from "../../query-client/QueryClient";

interface CropFieldCardProps {
  cropField: GetCropFieldDTO;
}

function PlotCard({ cropField }: CropFieldCardProps) {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { mutate } = useMutation({
    mutationFn: deleteCropFieldById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cropfields"] });
      navigate("/show-cropfields", {
        state: {
          success: true,
          message: "Field has been successfully deleted",
        },
      });
    },
  });

  const handleDeleteButtonClicked = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    mutate(cropField.uid);
    setDeleteDialogOpen(false);
  };

  const handleConfirmCancel = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Card
        elevation={6}
        sx={{
          mt: 5,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          transition: "transform 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Box sx={{ m: 1, textAlign: "center" }}>
          <Typography variant="h5" component={"h2"} sx={{ fontWeight: "bold" }}>
            {cropField.name}
          </Typography>
        </Box>

        <Box sx={{ width: "97.5%", margin: "auto" }}>
          <MapPreview
            mapHeight={300}
            isDraggable={false}
            isZoomable={false}
            isScrollable={false}
            setBounds={true}
            uid={cropField.uid}
            markerPosition={cropField.markerPosition}
            polygonPoints={cropField.polygonPoints}
            fieldParcels={[]}
          />
        </Box>

        <Box sx={{ display: "flex", m: 2, alignItems: "center" }}>
          <Button
            sx={{
              color: "white",
              bgcolor: "success.main",
              "&:hover": { bgcolor: "success.dark" },
            }}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              navigate(`/cropfield-details/${cropField.uid}`);
            }}
          >
            Details
          </Button>

          <Box sx={{ flexGrow: 1 }} />
          <DeleteCropFieldButton
            onDeleteButtonClicked={handleDeleteButtonClicked}
          />
        </Box>
      </Card>
      <DeleteCropFieldDialog
        onConfirmDelete={handleConfirmDelete}
        onConfirmCancel={handleConfirmCancel}
        open={deleteDialogOpen}
      />
    </>
  );
}

export default PlotCard;
