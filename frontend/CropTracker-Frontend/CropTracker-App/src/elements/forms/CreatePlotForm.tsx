import { useEffect, useState } from "react";
import type { PostPlot } from "../../interfaces/request/PostPlot";
import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import type { LatLngObject } from "../../interfaces/LatLngObject";
import EditableMap from "../../leaflet/EditableMap";
import { calculateArea } from "../../utils/CalculatePlotArea";

interface CreatePlotFormProps {
  isPending: boolean;
  onSubmit: (createPlot: PostPlot) => void;
}

function CreatePlotForm({ isPending, onSubmit }: CreatePlotFormProps) {
  const [createPlotData, setCreatePlotData] = useState<PostPlot>({
    name: "Unnamed Field",
    markerPosition: {
      lat: 51.505,
      lng: -0.09,
    },
    polygonPoints: [],
    area: 0,
  });

  const [markerAdded, setMarkerAdded] = useState(false);

  const changePlotName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreatePlotData((prev) => ({ ...prev, name: event.target.value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(createPlotData);
  };

  const handlePolygonCreated = (rawLatLngs: L.LatLng[]) => {
    const latLngs = Array.isArray(rawLatLngs[0])
      ? (rawLatLngs[0] as L.LatLng[])
      : (rawLatLngs as L.LatLng[]);
    const formattedPoints: LatLngObject[] = latLngs.map((latLng: L.LatLng) => ({
      lat: latLng.lat,
      lng: latLng.lng,
    }));
    setCreatePlotData((prev) => ({
      ...prev,
      polygonPoints: formattedPoints,
      area: calculateArea(formattedPoints),
    }));
  };

  const handleMarkerCreated = (rawLatLng: L.LatLng) => {
    setMarkerAdded(true);
    console.log("Marker created at:", rawLatLng);
    setCreatePlotData((prev) => ({
      ...prev,
      latitude: rawLatLng.lat,
      longitude: rawLatLng.lng,
    }));
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setCreatePlotData((prev) => ({
          ...prev,
          latitude: latitude,
          longitude: longitude,
        }));
      });
    }
  }, []);

  return (
    <>
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
          Create New Plot
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Complete the details below to add this area to your collection.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <FormControl sx={{ mt: 2 }} fullWidth>
              <TextField
                label="Field Name"
                color="success"
                name="username"
                value={createPlotData.name}
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
            either place a marker to set the center of your plot or draw a
            polygon to define its boundaries. If you draw a polygon, the center
            will be calculated automatically.
          </Typography>
          <EditableMap
            plot={{
              uid: "",
              name: createPlotData.name,
              markerPosition: createPlotData.markerPosition,
              polygonPoints: createPlotData.polygonPoints,
              area: createPlotData.area,
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
            {isPending ? "Uploading Plot..." : "Upload Plot"}
          </Button>
        </form>
      </Box>
    </>
  );
}

export default CreatePlotForm;
