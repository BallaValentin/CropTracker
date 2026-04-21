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
import {
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  Tooltip,
  LayersControl,
  LayerGroup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ChangeView from "../../leaflet/ChangeView";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import type { LatLngObject } from "../../interfaces/LatLngObject";
import MapEventsHelper from "../../utils/MapEventsHelper";

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
              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="OpenStreetMap">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="SatelliteView">
                  <LayerGroup>
                    <TileLayer
                      attribution="Tiles &copy; Esri..."
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                      maxNativeZoom={18}
                      maxZoom={20}
                    />

                    <TileLayer
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                      maxNativeZoom={18}
                      maxZoom={20}
                    />
                  </LayerGroup>
                </LayersControl.BaseLayer>

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
