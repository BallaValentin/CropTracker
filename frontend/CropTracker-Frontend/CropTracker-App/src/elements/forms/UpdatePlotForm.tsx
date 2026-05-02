import { useEffect, useState } from "react";
import type { Plot } from "../../interfaces/Plot";
import type { UpdatePlot } from "../../interfaces/request/UpdatePlot";
import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import type { LatLngObject } from "../../interfaces/LatLngObject";
import L from "leaflet";
import EditableMap from "../../leaflet/EditableMap";
import { calculateArea } from "../../utils/CalculatePlotArea";

interface UpdatePlotFormProps {
  plot: Plot;
  onUpdate: (updatedPlotData: UpdatePlot) => void;
  isPending: boolean;
}

function UpdatePlotForm({ plot, onUpdate, isPending }: UpdatePlotFormProps) {
  const [plotUpdateData, setPlotUpdateData] = useState<UpdatePlot>({
    name: plot.name,
    latitude: plot.latitude,
    longitude: plot.longitude,
    polygonPoints: plot.polygonPoints,
    area: plot.area,
  });

  useEffect(() => {
    setPlotUpdateData({
      name: plot.name,
      latitude: plot.latitude,
      longitude: plot.longitude,
      polygonPoints: plot.polygonPoints,
      area: plot.area,
    });
  }, [plot]);

  const [markerAdded, setMarkerAdded] = useState(
    plot.latitude !== 0 && plot.longitude !== 0,
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onUpdate(plotUpdateData);
  };

  const changePlotName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlotUpdateData((prev) => ({ ...prev, name: event.target.value }));
  };

  const handlePolygonCreated = (rawLatLngs: L.LatLng[]) => {
    const latLngs = Array.isArray(rawLatLngs[0])
      ? (rawLatLngs[0] as L.LatLng[])
      : (rawLatLngs as L.LatLng[]);
    const formattedPoints: LatLngObject[] = latLngs.map((latLng: L.LatLng) => ({
      lat: latLng.lat,
      lng: latLng.lng,
    }));
    setPlotUpdateData((prev) => ({
      ...prev,
      polygonPoints: formattedPoints,
    }));

    setPlotUpdateData((prev) => ({
      ...prev,
      area: calculateArea(formattedPoints),
    }));
  };

  const handleMarkerCreated = (rawLatLng: L.LatLng) => {
    setMarkerAdded(true);
    setPlotUpdateData((prev) => ({
      ...prev,
      latitude: rawLatLng.lat,
      longitude: rawLatLng.lng,
    }));
  };

  console.log("UpdatePlotForm rendered with plot update data:", plotUpdateData);

  return (
    <Box>
      <Typography
        variant="h4"
        component={"h1"}
        sx={{
          mb: 2,
          fontWeight: "bold",
          color: "success.main",
          letterSpacing: "0.02em",
        }}
      >
        Update Plot
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Update the details below to modify this field.
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <FormControl sx={{ mt: 2 }} fullWidth>
            <TextField
              label="Field Name"
              color="success"
              name="username"
              value={plotUpdateData.name}
              placeholder="Your username"
              required
              onChange={changePlotName}
              fullWidth
            />
          </FormControl>
        </Grid>

        <Typography
          variant="body2"
          sx={{
            mb: 2,
            color: "text.secondary",
            fontStyle: "italic",
            lineHeight: 1.6,
          }}
        >
          Select the location and the outline of your plot on the map. You can
          either place a marker to set the center of your plot or draw a polygon
          to define its boundaries. If you draw a polygon, the center will be
          calculated automatically.
        </Typography>
        <EditableMap
          plot={{
            uid: plot.uid,
            name: plotUpdateData.name,
            latitude: plotUpdateData.latitude,
            longitude: plotUpdateData.longitude,
            polygonPoints: plotUpdateData.polygonPoints,
            area: plotUpdateData.area,
          }}
          markerAdded={markerAdded}
          onMarkerCreated={handleMarkerCreated}
          onPolygonCreated={handlePolygonCreated}
        />
        <Button
          disabled={isPending}
          sx={{
            bgcolor: "success.main",
            "&:hover": { bgcolor: "success.dark" },
            "&:disabled": {
              bgcolor: "success.light",
              color: "success.contrastText",
            },
            color: "white",
          }}
          type="submit"
        >
          {isPending ? "Updating Field..." : "Update Field"}
        </Button>
      </form>
    </Box>
  );
}

export default UpdatePlotForm;
