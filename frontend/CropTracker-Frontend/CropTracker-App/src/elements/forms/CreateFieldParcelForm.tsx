import { Autocomplete, Box, Paper, TextField, Typography } from "@mui/material";
import type { GetCropFieldDTO } from "../../interfaces/response/GetCropFieldDTO";
import { useCropSearch } from "../../hooks/UseCropSearch";
import { useState } from "react";
import type { CreateFieldParcelDTO } from "../../interfaces/response/CreateFieldParcelDTO";
import AddParcelView from "../../leaflet/AddParcelsView";
import { ChromePicker, type ColorResult } from "react-color";
import type { LatLngObject } from "../../interfaces/LatLngObject";

interface CreateFieldParcelFormProps {
  onSubmit: (createFieldParcelData: CreateFieldParcelDTO) => void;
  cropfield: GetCropFieldDTO;
}

function CreateFieldParcelForm({
  onSubmit,
  cropfield,
}: CreateFieldParcelFormProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newFieldParcel, setNewFieldParcel] = useState<CreateFieldParcelDTO>({
    cropName: "",
    polygonPoints: [],
    overlayColor: "#ff0000",
  });

  const { data: crops, isPending } = useCropSearch(searchTerm);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(newFieldParcel);
  };

  const handleCropSelect = (newCropName: string) => {
    setNewFieldParcel((prev) => ({
      ...prev,
      cropName: newCropName,
    }));
  };

  const changeOverlayColor = (color: ColorResult) => {
    setNewFieldParcel((prev) => ({
      ...prev,
      overlayColor: color.hex,
    }));
  };

  const handleFieldParcelPolygonCreated = (latLngs: LatLngObject[]) => {
    setNewFieldParcel((prev) => ({
      ...prev,
      polygonPoints: latLngs,
    }));
  };

  const handleFieldParcelPolygonDeleted = () => {
    setNewFieldParcel((prev) => ({
      ...prev,
      polygonPoints: [],
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
              polygonColor={newFieldParcel.overlayColor}
              onParcelAdded={handleFieldParcelPolygonCreated}
              onParcelDeleted={handleFieldParcelPolygonDeleted}
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
                  handleCropSelect(newValue?.cultivarName || "");
                }}
                renderInput={(params) => (
                  <TextField
                    color="success"
                    {...params}
                    label="Search Crop Cultivar"
                  />
                )}
              />
            </form>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Select Overlay Color
            </Typography>
            <ChromePicker
              color={newFieldParcel.overlayColor}
              onChangeComplete={(color) => changeOverlayColor(color)}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default CreateFieldParcelForm;
