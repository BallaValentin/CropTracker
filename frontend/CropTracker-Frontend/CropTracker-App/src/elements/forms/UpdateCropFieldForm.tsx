import { useEffect, useState } from "react";
import type { GetCropFieldData } from "../../interfaces/response/GetCropFieldData";
import type { UpdateCropFieldData } from "../../interfaces/request/UpdateCropFieldData";
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
import { calculatePolygonArea } from "../../utils/PolygonHelper";
import type { GetFieldParcelData } from "../../interfaces/response/GetFieldParcelData";

interface UpdateCropFieldFormProps {
  cropField: GetCropFieldData;
  onUpdate: (updatedGetCropFieldData: UpdateCropFieldData) => void;
  isPending: boolean;
}

function UpdateGetCropFieldForm({
  cropField,
  onUpdate,
  isPending,
}: UpdateCropFieldFormProps) {
  const [cropFieldUpdateData, setCropFieldUpdateData] =
    useState<UpdateCropFieldData>({
      name: cropField.name,
      markerPosition: cropField.markerPosition,
      polygonPoints: cropField.polygonPoints,
      area: cropField.area,
    });

  const [markerAdded, setMarkerAdded] = useState<boolean>(
    !!cropField.markerPosition,
  );

  useEffect(() => {
    setCropFieldUpdateData({
      name: cropField.name,
      markerPosition: cropField.markerPosition,
      polygonPoints: cropField.polygonPoints,
      area: cropField.area,
    });
    setMarkerAdded(!!cropField.markerPosition);
  }, [cropField]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onUpdate(cropFieldUpdateData);
  };

  const changeCropFieldName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCropFieldUpdateData((prev) => ({ ...prev, name: event.target.value }));
  };

  const handlePolygonCreated = (rawLatLngs: L.LatLng[]) => {
    const latLngs = Array.isArray(rawLatLngs[0])
      ? (rawLatLngs[0] as L.LatLng[])
      : (rawLatLngs as L.LatLng[]);
    const formattedPoints: LatLngObject[] = latLngs.map((latLng: L.LatLng) => ({
      lat: latLng.lat,
      lng: latLng.lng,
    }));
    setCropFieldUpdateData((prev) => ({
      ...prev,
      polygonPoints: formattedPoints,
    }));

    setCropFieldUpdateData((prev) => ({
      ...prev,
      area: calculatePolygonArea(formattedPoints),
    }));
  };

  const handlePolygonDeleted = () => {
    setCropFieldUpdateData((prev) => ({
      ...prev,
      polygonPoints: [],
      area: 0,
    }));
  };

  const handleMarkerCreated = (rawLatLng: L.LatLng) => {
    setCropFieldUpdateData((prev) => ({
      ...prev,
      markerPosition: {
        lat: rawLatLng.lat,
        lng: rawLatLng.lng,
      },
    }));
    setMarkerAdded(true);
  };

  const handleMarkerDeleted = () => {
    setMarkerAdded(false);
    setCropFieldUpdateData((prev) => ({
      ...prev,
      markerPosition: null,
    }));
  };

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
        Update crop field
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
              value={cropFieldUpdateData.name}
              placeholder="Your username"
              required
              onChange={changeCropFieldName}
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
          Select the location and the outline of your GetCropField on the map.
          You can either place a marker to set the center of your GetCropField
          or draw a polygon to define its boundaries. If you draw a polygon, the
          center will be calculated automatically.
        </Typography>
        <EditableMap
          cropField={{
            uid: cropField.uid,
            name: cropFieldUpdateData.name,
            markerPosition: cropFieldUpdateData.markerPosition,
            polygonPoints: cropFieldUpdateData.polygonPoints,
            area: cropFieldUpdateData.area,
            fieldParcels: [] as GetFieldParcelData[],
          }}
          markerAdded={markerAdded}
          onMarkerCreated={handleMarkerCreated}
          onMarkerDeleted={handleMarkerDeleted}
          onPolygonCreated={handlePolygonCreated}
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
          {isPending ? "Updating Field..." : "Update Field"}
        </Button>
      </form>
    </Box>
  );
}

export default UpdateGetCropFieldForm;
