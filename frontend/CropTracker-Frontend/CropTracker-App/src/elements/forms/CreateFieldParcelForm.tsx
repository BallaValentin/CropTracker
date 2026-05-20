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
import type { CreateFieldParcelDTO } from "../../interfaces/request/CreateFieldParcelDTO";
import { calculatePolygonArea } from "../../utils/PolygonHelper";
import type { GetFieldParcelDTO } from "../../interfaces/response/GetFieldParcelDTO";

interface CreateFieldParcelFormProps {
  onSubmit: (createFieldParcelData: CreateFieldParcelDTO) => void;
  isPending: boolean;
  cropfield: GetCropFieldDTO;
  fieldParcels: GetFieldParcelDTO[];
}

function CreateFieldParcelForm({
  onSubmit,
  cropfield,
  isPending,
  fieldParcels,
}: CreateFieldParcelFormProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newFieldParcel, setNewFieldParcel] = useState<CreateFieldParcelDTO>({
    cropFieldId: cropfield.uid,
    cropCultivarId: "",
    area: 0,
    polygonPoints: [] as LatLngObject[],
    polygonColor: "#ff0000",
  });

  const { data: crops } = useCropSearch(searchTerm);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(newFieldParcel);
  };

  const handleCropSelect = (cropCultivarId: string) => {
    setNewFieldParcel((prev) => ({
      ...prev,
      cropCultivarId: cropCultivarId || "",
    }));
  };

  const changeOverlayColor = (color: ColorResult) => {
    setNewFieldParcel((prev) => ({
      ...prev,
      polygonColor: color.hex,
    }));
  };

  const handleFieldParcelPolygonCreated = (latLngs: LatLngObject[]) => {
    setNewFieldParcel((prev) => ({
      ...prev,
      polygonPoints: latLngs,
      area: calculatePolygonArea(latLngs),
    }));
  };

  const handleFieldParcelPolygonUpdated = (latLngs: LatLngObject[]) => {
    setNewFieldParcel((prev) => ({
      ...prev,
      polygonPoints: latLngs,
      area: calculatePolygonArea(latLngs),
    }));
  };

  const handleFieldParcelPolygonDeleted = () => {
    setNewFieldParcel((prev) => ({
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
          Create Field Parcel
        </Typography>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ flex: 1, p: 2 }}>
            <AddParcelView
              polygonPoints={cropfield.polygonPoints}
              markerPosition={cropfield.markerPosition}
              uid={cropfield.uid}
              mapHeight={500}
              parcelPolygonPoints={newFieldParcel.polygonPoints}
              polygonColor={newFieldParcel.polygonColor}
              onParcelAdded={handleFieldParcelPolygonCreated}
              onParcelUpdated={handleFieldParcelPolygonUpdated}
              onParcelDeleted={handleFieldParcelPolygonDeleted}
              fieldParcels={fieldParcels}
              allowCreate={true}
              allowDelete={true}
            />
          </Box>
          <Box sx={{ flex: 1, p: 2 }}>
            <form onSubmit={handleSubmit}>
              <Autocomplete
                options={crops || []}
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
                color={newFieldParcel.polygonColor}
                onChangeComplete={(color) => changeOverlayColor(color)}
              />
              <Button
                type="submit"
                disabled={isPending}
                variant="contained"
                color="success"
                sx={{ mt: 3 }}
              >
                {isPending ? "Creating..." : "Create Field Parcel"}
              </Button>
            </form>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default CreateFieldParcelForm;
