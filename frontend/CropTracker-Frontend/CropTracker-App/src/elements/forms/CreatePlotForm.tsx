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
import { FeatureGroup, MapContainer, Polygon, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ChangeView from "../../leaflet/ChangeView";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import type { LatLngObject } from "../../interfaces/LatLngObject";
import { blueCircleIcon } from "../icons/BlueCircleIcon";

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

  const changePlotName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreatePlotData((prev) => ({ ...prev, name: event.target.value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(createPlotData);
  };

  const handlePolygonCreated = (e: L.DrawEvents.Created) => {
    const { layer, layerType } = e;
    if (layerType === "polygon") {
      const polygonLayer = layer as L.Polygon;
      const rawLatLngs = polygonLayer.getLatLngs();
      const latLngs = Array.isArray(rawLatLngs[0])
        ? (rawLatLngs[0] as L.LatLng[])
        : (rawLatLngs as L.LatLng[]);
      const formattedPoints: LatLngObject[] = latLngs.map(
        (latLng: L.LatLng) => ({
          lat: latLng.lat,
          lng: latLng.lng,
        }),
      );
      setCreatePlotData((prev) => ({
        ...prev,
        polygonPoints: formattedPoints,
      }));

      layer.remove();
    }
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
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <FormControl sx={{ mt: 2 }} fullWidth>
              <Typography
                sx={{ fontWeight: "bold" }}
                variant="body1"
                gutterBottom
              >
                Name of your plot
              </Typography>
              <TextField
                name="username"
                value={createPlotData.name}
                placeholder="Your username"
                required
                onChange={changePlotName}
                fullWidth
              />
            </FormControl>
          </Grid>

          <Box sx={{ position: "relative", mt: 2, height: 600, width: "100%" }}>
            <MapContainer
              style={{ height: "100%" }}
              center={[createPlotData.latitude, createPlotData.longitude]}
              zoom={13}
            >
              <ChangeView
                center={[createPlotData.latitude, createPlotData.longitude]}
                zoom={16}
              />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FeatureGroup>
                <EditControl
                  position="topright"
                  onCreated={handlePolygonCreated}
                  draw={{
                    marker: true,
                    polyline: false,
                    circle: false,
                    rectangle: false,
                    circlemarker: false,
                    polygon: {
                      allowIntersection: false,
                      drawError: {
                        color: "#e1e100",
                        message:
                          "<strong>Error:<strong> shape edges cannot intersect!",
                      },
                      icon: blueCircleIcon,
                      shapeOptions: {
                        color: "#3388FF",
                      },
                    },
                  }}
                />
                {createPlotData.polygonPoints.length > 0 && (
                  <Polygon
                    key={Date.now()}
                    positions={createPlotData.polygonPoints}
                    pathOptions={{ color: "blue" }}
                  />
                )}
              </FeatureGroup>
            </MapContainer>
          </Box>

          <Button disabled={isPending} color="success" type="submit">
            {isPending ? "Uploading Plot..." : "Upload Plot"}
          </Button>
        </form>
      </Box>
    </>
  );
}

export default CreatePlotForm;
