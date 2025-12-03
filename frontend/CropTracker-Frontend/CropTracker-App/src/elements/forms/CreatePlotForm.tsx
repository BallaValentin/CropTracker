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
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MovableMarker from "../../leaflet/MovableMarker";

interface CreatePlotFormProps {
  isPending: boolean;
  onSubmit: (createPlot: PostPlot) => void;
}

function CreatePlotForm({ isPending, onSubmit }: CreatePlotFormProps) {
  const [createPlotData, setCreatePlotData] = useState<PostPlot>({
    name: "Unnamed Plot",
    latitude: 0.0,
    longitude: 0.0,
  });

  const changePlotName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreatePlotData((prev) => ({ ...prev, name: event.target.value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(createPlotData);
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

  const updateMapLocation = (latitude: number, longitude: number) => {
    setCreatePlotData((prev) => ({
      ...prev,
      latitude: latitude,
      longitude: longitude,
    }));
  };

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

          <Box sx={{ mt: 2, height: 600, width: "100%" }}>
            <MapContainer
              style={{ height: "100%" }}
              center={{
                lat: createPlotData.latitude,
                lng: createPlotData.longitude,
              }}
              zoom={13}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MovableMarker
                latitude={createPlotData.latitude}
                longitude={createPlotData.longitude}
                onLocationClick={(latitude, longitude) =>
                  updateMapLocation(latitude, longitude)
                }
              />
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
