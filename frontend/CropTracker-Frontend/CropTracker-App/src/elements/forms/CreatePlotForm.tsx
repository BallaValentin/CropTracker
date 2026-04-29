import { useEffect, useState } from "react";
import type { PostPlot } from "../../interfaces/request/PostPlot";
import {
  Box,
  Button,
  FormControl,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  MapContainer,
  Marker,
  Polygon,
  Tooltip,
  LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ChangeView from "../../leaflet/ChangeView";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import type { LatLngObject } from "../../interfaces/LatLngObject";
import MapEventsHelper from "../../utils/MapEventsHelper";
import CustomLayers from "../../leaflet/CustomLayers";

interface CreatePlotFormProps {
  isPending: boolean;
  onSubmit: (createPlot: PostPlot) => void;
}

function CreatePlotForm({ isPending, onSubmit }: CreatePlotFormProps) {
  const [createPlotData, setCreatePlotData] = useState<PostPlot>({
    name: "Unnamed Plot",
    latitude: 51.505,
    longitude: -0.09,
    polygonPoints: [],
  });

  const [plotArea, setPlotArea] = useState<number>(0);

  const [markerAdded, setMarkerAdded] = useState(false);

  const changePlotName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreatePlotData((prev) => ({ ...prev, name: event.target.value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(createPlotData);
  };

  const handlePolygonCreated = (rawLatLngs: L.LatLng[], area: number) => {
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
    }));

    setPlotArea(area);
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
            mt: 2,
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
                label="Plot Name"
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
          <Paper
            elevation={0}
            sx={{
              position: "relative",
              overflow: "hidden",
              mt: 2,
              mb: 2,
              height: 600,
              width: "100%",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <MapContainer
              style={{ height: "100%" }}
              center={[createPlotData.latitude, createPlotData.longitude]}
              zoom={13}
            >
              <LayersControl position="topright">
                <CustomLayers />

                <ChangeView
                  center={[createPlotData.latitude, createPlotData.longitude]}
                  zoom={16}
                />

                <LayersControl.Overlay checked name="Draw tools">
                  <MapEventsHelper
                    onPolygonCreated={handlePolygonCreated}
                    onMarkerCreated={handleMarkerCreated}
                  />
                </LayersControl.Overlay>
              </LayersControl>

              {markerAdded && (
                <Marker
                  key={crypto.randomUUID()}
                  position={[createPlotData.latitude, createPlotData.longitude]}
                />
              )}

              {createPlotData.polygonPoints.length > 0 && (
                <Polygon
                  key={crypto.randomUUID()}
                  positions={createPlotData.polygonPoints}
                  pathOptions={{ color: "blue" }}
                  eventHandlers={{
                    mouseover: (e) => {
                      const layer = e.target;
                      layer.setStyle({ fillOpacity: 0.7 });
                      layer.openTooltip();
                    },
                    mouseout: (e) => {
                      const layer = e.target;
                      layer.setStyle({ fillOpacity: 0.2 });
                      layer.closeTooltip();
                    },
                  }}
                >
                  <Tooltip direction="top" className="area-tooltip" opacity={1}>
                    Area: {(plotArea / 10000).toFixed(2)} ha
                  </Tooltip>
                </Polygon>
              )}
            </MapContainer>
          </Paper>
          <Button
            disabled={isPending}
            sx={{
              bgcolor: "success.main",
              "&:hover": { bgcolor: "success.dark" },
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
