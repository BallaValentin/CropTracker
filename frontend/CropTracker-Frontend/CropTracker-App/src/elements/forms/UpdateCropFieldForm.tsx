import { useEffect, useState } from "react";
import type { GetCropFieldDTO } from "../../interfaces/response/GetCropFieldDTO";
import type { UpdateCropFieldDTO } from "../../interfaces/request/UpdateCropFieldDTO";
import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import type { LatLngObject } from "../../interfaces/helper/LatLngObject";
import EditableMap from "../../leaflet/view/EditableMap";
import { calculatePolygonArea } from "../../utils/PolygonHelper";
import ErrorIcon from "@mui/icons-material/Error";
import { getNameError, getPolygonError } from "../../utils/FormSubmitHelper";
import { useTranslation } from "react-i18next";

interface UpdateCropFieldFormProps {
  cropField: GetCropFieldDTO;
  onUpdate: (updatedGetCropFieldData: UpdateCropFieldDTO) => void;
  isPending: boolean;
}

function UpdateCropFieldForm({
  cropField,
  onUpdate,
  isPending,
}: UpdateCropFieldFormProps) {
  const { t } = useTranslation();

  const [cropFieldUpdateData, setCropFieldUpdateData] =
    useState<UpdateCropFieldDTO>({
      name: cropField.name,
      markerPosition: cropField.markerPosition,
      polygonPoints: cropField.polygonPoints,
      area: cropField.area,
    });

  const [markerAdded, setMarkerAdded] = useState<boolean>(
    !!cropField.markerPosition,
  );

  const [cropFieldError, setCropFieldError] = useState<Record<string, string>>({
    nameError: "",
    markerError: "",
    polygonError: "",
  });

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

    const nameError = getNameError(cropFieldUpdateData.name) || "";
    if (nameError) {
      setCropFieldError((prev) => ({
        ...prev,
        nameError: nameError,
      }));
    }

    const markerError =
      !markerAdded || cropFieldUpdateData.markerPosition == null
        ? t("elements.forms.updateCropFieldForm.markerMissingError", {
            defaultValue: "Field location marker is missing",
          })
        : "";

    setCropFieldError((prev) => ({
      ...prev,
      markerError: markerError,
    }));

    const polygonError =
      getPolygonError(cropFieldUpdateData.polygonPoints) || "";
    setCropFieldError((prev) => ({
      ...prev,
      polygonError: polygonError,
    }));
    if (nameError || !!markerError || !!polygonError) return;

    onUpdate(cropFieldUpdateData);
  };

  const changeCropFieldName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setCropFieldUpdateData((prev) => ({ ...prev, name: newName }));
  };

  const handlePolygonCreated = (polygonPoints: LatLngObject[]) => {
    setCropFieldUpdateData((prev) => ({
      ...prev,
      polygonPoints: polygonPoints,
    }));

    setCropFieldUpdateData((prev) => ({
      ...prev,
      area: calculatePolygonArea(polygonPoints),
    }));
  };

  const handlePolygonDeleted = () => {
    setCropFieldUpdateData((prev) => ({
      ...prev,
      polygonPoints: [],
      area: 0,
    }));
  };

  const handleMarkerCreated = (markerPoint: LatLngObject) => {
    setCropFieldUpdateData((prev) => ({
      ...prev,
      markerPosition: markerPoint,
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
        {t("elements.forms.updateCropFieldForm.formTitle", {
          defaultValue: "Update crop field",
        })}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {t("elements.forms.updateCropFieldForm.formText", {
          defaultValue: "Update the details below to modify this field.",
        })}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <FormControl sx={{ mt: 2 }} fullWidth>
            <TextField
              label={t("elements.forms.updateCropFieldForm.fieldNameLabel", {
                defaultValue: "Field Name",
              })}
              color="success"
              name="username"
              value={cropFieldUpdateData.name}
              placeholder={t(
                "elements.forms.updateCropFieldForm.placeholderText",
                {
                  defaultValue: "Your field`s name",
                },
              )}
              required
              error={!!cropFieldError.nameError}
              helperText={cropFieldError.nameError || " "}
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
          {t("elements.forms.updateCropFieldForm.longText", {
            defaultValue:
              "Select the location and the outline of your crop field on the map. You can either place a marker to set the center of your field or draw a polygon to define its boundaries. If you draw a polygon, the center will be calculated automatically.",
          })}
        </Typography>
        <EditableMap
          hasMarker={true}
          markerPosition={cropFieldUpdateData.markerPosition}
          polygonPoints={cropFieldUpdateData.polygonPoints}
          markerAdded={markerAdded}
          onMarkerCreated={handleMarkerCreated}
          onMarkerDeleted={handleMarkerDeleted}
          onPolygonCreated={handlePolygonCreated}
          onPolygonDeleted={handlePolygonDeleted}
        />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
          {cropFieldError.markerError && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ErrorIcon fontSize="small" color="error" />
              <Typography color="error">
                {cropFieldError.markerError}
              </Typography>
            </Box>
          )}

          {cropFieldError.polygonError && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ErrorIcon fontSize="small" color="error" />
              <Typography color="error">
                {cropFieldError.polygonError}
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
          {isPending
            ? t("elements.forms.updateCropFieldForm.updateButtonPending", {
                defaultValue: "Updating Field...",
              })
            : t("elements.forms.updateCropFieldForm.updateButton", {
                defaultValue: "Update Field",
              })}
        </Button>
      </form>
    </Box>
  );
}

export default UpdateCropFieldForm;
