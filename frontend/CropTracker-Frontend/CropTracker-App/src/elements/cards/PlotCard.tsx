import { Box, Button, Card, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Plot } from "../../interfaces/Plot";
import MapPreview from "../../leaflet/MapPreview";
import DeletePlotButton from "../buttons/DeletePlotButton";
import DeletePlotDialog from "../dialogs/DeletePlotDialog";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { deletePlotById } from "../../services/PlotService";
import { queryClient } from "../../query-client/QueryClient";

interface PlotCardProps {
  plot: Plot;
}

function PlotCard({ plot }: PlotCardProps) {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { mutate } = useMutation({
    mutationFn: deletePlotById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plots"] });
    },
  });

  const handleDeleteButtonClicked = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    mutate(plot.uid);
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
            {plot.name}
          </Typography>
        </Box>

        <MapPreview
          uid={plot.uid}
          latitude={plot.latitude}
          longitude={plot.longitude}
          polygonPoints={plot.polygonPoints}
        />

        <Box sx={{ display: "flex", m: 2, alignItems: "center" }}>
          <Button
            sx={{
              color: "white",
              bgcolor: "#7bbf8fff",
            }}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              navigate(`/plot-details/${plot.uid}`);
            }}
          >
            Details
          </Button>

          <Box sx={{ flexGrow: 1 }} />
          <DeletePlotButton onDeleteButtonClicked={handleDeleteButtonClicked} />
        </Box>
      </Card>
      <DeletePlotDialog
        onConfirmDelete={handleConfirmDelete}
        onConfirmCancel={handleConfirmCancel}
        open={deleteDialogOpen}
      />
    </>
  );
}

export default PlotCard;
