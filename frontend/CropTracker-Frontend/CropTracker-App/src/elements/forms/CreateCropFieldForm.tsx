import { useEffect, useState } from "react";
import type { CreateCropFieldDTO } from "../../interfaces/request/CreateCropFieldDTO";
import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import type { LatLngObject } from "../../interfaces/LatLngObject";
import EditableMap from "../../leaflet/EditableMap";
import { calculatePolygonArea } from "../../utils/PolygonHelper";
import { defaultMapPosition } from "../../utils/Constants";

interface CreateCropFieldFormProps {
  isPending: boolean;
  onSubmit: (createPlot: CreateCropFieldDTO) => void;
}

function CreatePlotForm({ isPending, onSubmit }: CreateCropFieldFormProps) {
  const [createCropFieldData, setCreateCropFieldData] =
    useState<CreateCropFieldDTO>({
      name: "Unnamed Field",
      markerPosition: null,
      polygonPoints: [],
      area: 0,
    });

  const [markerAdded, setMarkerAdded] = useState(false);

  const changePlotName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreateCropFieldData((prev) => ({ ...prev, name: event.target.value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Marker Position:", createCropFieldData.markerPosition);
    onSubmit(createCropFieldData);
  };

  const handlePolygonCreated = (polygonPoints: LatLngObject[]) => {
    setCreateCropFieldData((prev) => ({
      ...prev,
      polygonPoints: polygonPoints,
      area: calculatePolygonArea(polygonPoints),
    }));
  };

  const handlePolygonDeleted = () => {
    setCreateCropFieldData((prev) => ({
      ...prev,
      polygonPoints: [],
      area: 0,
    }));
  };

  const handleMarkerCreated = (markerPoint: LatLngObject) => {
    setMarkerAdded(true);
    setCreateCropFieldData((prev) => ({
      ...prev,
      markerPosition: markerPoint,
    }));
  };

  const handleMarkerDeleted = () => {
    setMarkerAdded(false);
    setCreateCropFieldData((prev) => ({
      ...prev,
      markerPosition: defaultMapPosition,
    }));
  };
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setCreateCropFieldData((prev) => ({
          ...prev,
          markerPosition: {
            lat: latitude,
            lng: longitude,
          },
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
                value={createCropFieldData.name}
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
            cropField={{
              uid: "",
              name: createCropFieldData.name,
              markerPosition:
                createCropFieldData.markerPosition || defaultMapPosition,
              polygonPoints: createCropFieldData.polygonPoints,
              area: createCropFieldData.area,
            }}
            markerAdded={markerAdded}
            onMarkerCreated={handleMarkerCreated}
            onPolygonCreated={handlePolygonCreated}
            onMarkerDeleted={handleMarkerDeleted}
            onPolygonDeleted={handlePolygonDeleted}
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
            {isPending ? "Uploading Field..." : "Create Field"}
          </Button>
        </form>
      </Box>
    </>
  );
}

export default CreatePlotForm;
