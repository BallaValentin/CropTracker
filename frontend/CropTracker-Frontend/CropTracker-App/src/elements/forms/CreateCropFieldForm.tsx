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
import type { LatLngObject } from "../../interfaces/helper/LatLngObject";
import EditableMap from "../../leaflet/EditableMap";
import { calculatePolygonArea } from "../../utils/PolygonHelper";
import { defaultMapPosition } from "../../utils/Constants";
import ErrorIcon from "@mui/icons-material/Error";
import { getNameError, getPolygonError } from "../../utils/FormSubmitHelper";

interface CreateCropFieldFormProps {
  isPending: boolean;
  onSubmit: (createCropFieldDTO: CreateCropFieldDTO) => void;
}

function CreatePlotForm({ isPending, onSubmit }: CreateCropFieldFormProps) {
  const [createCropFieldData, setCreateCropFieldData] =
    useState<CreateCropFieldDTO>({
      name: "Unnamed Field",
      markerPosition: null,
      polygonPoints: [],
      area: 0,
    });
  const [createCropFieldError, setCropFieldError] = useState<
    Record<string, string>
  >({
    nameError: "",
    markerError: "",
    polygonError: "",
  });

  const [markerAdded, setMarkerAdded] = useState(false);

  const changePlotName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreateCropFieldData((prev) => ({ ...prev, name: event.target.value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const nameError = getNameError(createCropFieldData.name) || "";
    if (nameError) {
      setCropFieldError((prev) => ({
        ...prev,
        nameError: nameError,
      }));
    }

    const markerError =
      !markerAdded || createCropFieldData.markerPosition == null
        ? "Field location marker is missing"
        : "";

    setCropFieldError((prev) => ({
      ...prev,
      markerError: markerError,
    }));

    const polygonError =
      getPolygonError(createCropFieldData.polygonPoints) || "";
    setCropFieldError((prev) => ({
      ...prev,
      polygonError: polygonError,
    }));
    if (nameError || !!markerError || !!polygonError) return;
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
        setMarkerAdded(true);
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
          Create New Crop Field
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
                error={!!createCropFieldError.nameError}
                helperText={createCropFieldError.nameError || " "}
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
            Select the location and the outline of your crop field on the map.
            You can either place a marker to set the center of your field or
            draw a polygon to define its boundaries. If you draw a polygon, the
            center will be calculated automatically.
          </Typography>
          <EditableMap
            markerPosition={
              createCropFieldData.markerPosition || defaultMapPosition
            }
            polygonPoints={createCropFieldData.polygonPoints}
            markerAdded={markerAdded}
            onMarkerCreated={handleMarkerCreated}
            onPolygonCreated={handlePolygonCreated}
            onMarkerDeleted={handleMarkerDeleted}
            onPolygonDeleted={handlePolygonDeleted}
          />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
            {createCropFieldError.markerError && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ErrorIcon fontSize="small" color="error" />
                <Typography color="error">
                  {createCropFieldError.markerError}
                </Typography>
              </Box>
            )}

            {createCropFieldError.polygonError && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ErrorIcon fontSize="small" color="error" />
                <Typography color="error">
                  {createCropFieldError.polygonError}
                </Typography>
              </Box>
            )}
          </Box>

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
