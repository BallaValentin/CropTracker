import {
  Autocomplete,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import type { GetCropFieldDTO } from "../../interfaces/response/GetCropFieldDTO";
import { useCropSearch } from "../../hooks/UseCropSearch";
import { useState } from "react";
import AddParcelView from "../../leaflet/AddParcelsView";
import { ChromePicker, type ColorResult } from "react-color";
import type { LatLngObject } from "../../interfaces/LatLngObject";
import { calculatePolygonArea } from "../../utils/PolygonHelper";
import type { GetFieldParcelDTO } from "../../interfaces/response/GetFieldParcelDTO";
import type { UpdateFieldParcelDTO } from "../../interfaces/request/UpdateFieldParcelDTO";

interface UpdateFieldParcelFormProps {
  onSubmit: (
    updateFieldParcelDTO: UpdateFieldParcelDTO,
    cropFieldId: string,
  ) => void;
  isPending: boolean;
  cropfield: GetCropFieldDTO;
  fieldParcelToUpdate: GetFieldParcelDTO;
  fieldParcels: GetFieldParcelDTO[];
}

function UpdateFieldParcelForm({
  onSubmit,
  cropfield,
  isPending,
  fieldParcelToUpdate,
  fieldParcels,
}: UpdateFieldParcelFormProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [fieldParcelUpdate, setFieldParcelUpdate] =
    useState<UpdateFieldParcelDTO>({
      cropFieldId: cropfield.uid,
      cropCultivarId: fieldParcelToUpdate.cultivarId,
      area: fieldParcelToUpdate.area,
      polygonPoints: fieldParcelToUpdate.polygonPoints,
      polygonColor: fieldParcelToUpdate.polygonColor,
    });

  const { data: crops } = useCropSearch(searchTerm);
  const cropsList = crops || [];

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(fieldParcelUpdate, fieldParcelToUpdate.uid);
  };

  const handleCropSelect = (cropCultivarId: string) => {
    setFieldParcelUpdate((prev) => ({
      ...prev,
      cropCultivarId: cropCultivarId || "",
    }));
  };

  const changeOverlayColor = (color: ColorResult) => {
    setFieldParcelUpdate((prev) => ({
      ...prev,
      polygonColor: color.hex,
    }));
  };

  const handleFieldParcelPolygonCreated = (latLngs: LatLngObject[]) => {
    setFieldParcelUpdate((prev) => ({
      ...prev,
      polygonPoints: latLngs,
      area: calculatePolygonArea(latLngs),
    }));
  };

  const handleFieldParcelPolygonDeleted = () => {
    setFieldParcelUpdate((prev) => ({
      ...prev,
      polygonPoints: [],
      area: 0,
    }));
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          mb: 2,
          mt: 2,
          height: 600,
          width: "100%",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Typography
          variant="h6"
          sx={{ p: 2, fontWeight: "bold", letterSpacing: "0.05rem" }}
        >
          Update Field Parcel
        </Typography>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ flex: 1, p: 2 }}>
            <AddParcelView
              polygonPoints={cropfield.polygonPoints}
              markerPosition={cropfield.markerPosition}
              uid={cropfield.uid}
              mapHeight={500}
              parcelPolygonPoints={fieldParcelUpdate.polygonPoints}
              polygonColor={fieldParcelUpdate.polygonColor}
              onParcelAdded={handleFieldParcelPolygonCreated}
              onParcelDeleted={handleFieldParcelPolygonDeleted}
              fieldParcels={fieldParcels}
            />
          </Box>
          <Box sx={{ flex: 1, p: 2 }}>
            <form onSubmit={handleSubmit}>
              <Autocomplete
                options={cropsList}
                getOptionLabel={(option) =>
                  `${option.cultivarName} (${option.specieName})`
                }
                loading={isPending}
                onInputChange={(_event, newInputValue) => {
                  setSearchTerm(newInputValue);
                }}
                onChange={(_event, newValue) => {
                  handleCropSelect(newValue?.uid || "");
                }}
                renderInput={(params) => (
                  <TextField
                    color="success"
                    {...params}
                    label="Search Crop Cultivar"
                  />
                )}
              />
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Select Overlay Color
              </Typography>
              <ChromePicker
                color={fieldParcelUpdate.polygonColor}
                onChangeComplete={(color) => changeOverlayColor(color)}
              />
              <Button
                type="submit"
                disabled={isPending}
                variant="contained"
                color="success"
                sx={{ mt: 3 }}
              >
                {isPending ? "Updating..." : "Update Field Parcel"}
              </Button>
            </form>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default UpdateFieldParcelForm;
