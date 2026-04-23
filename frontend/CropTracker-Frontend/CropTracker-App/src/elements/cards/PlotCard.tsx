import { Box, Button, Card, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Plot } from "../../interfaces/Plot";
import MapPreview from "../../leaflet/MapPreview";

interface PlotCardProps {
  plot: Plot;
}

function PlotCard({ plot }: PlotCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      elevation={6}
      sx={{
        mt: 5,
        cursor: "pointer",
        //border: "2px solid #e0dbdbff",
      }}
    >
      <Box sx={{ m: 1, textAlign: "center" }}>
        <Typography variant="h5">{plot.name}</Typography>
      </Box>

      <MapPreview
        uid={plot.uid}
        latitude={plot.latitude}
        longitude={plot.longitude}
        polygonPoints={plot.polygonPoints}
      />

      <Button
        sx={{
          ml: 1,
          mb: 1,
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
    </Card>
  );
}

export default PlotCard;
