import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  type SelectChangeEvent,
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
import { LayoutTypes } from "../../utils/LayoutTypes";

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
    layoutType: "",
    layoutParameters: {
      bedSpacing: 10,
      plantSpacing: 30,
      rowSpacing: null,
      azimuth: 0,
      numberOfRows: 0,
    },
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

  const handleLayoutChange = (event: SelectChangeEvent) => {
    setNewFieldParcel((prev) => ({
      ...prev,
      layoutType: event.target.value,
    }));
  };

  const handleLayoutParamsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    setNewFieldParcel((prev) => ({
      ...prev,
      layoutParameters: {
        ...prev.layoutParameters,
        [name]: value,
      },
    }));
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          mb: 2,
          mt: 2,
          height: 800,
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
        <Box sx={{ display: "flex", height: "100%" }}>
          <Box sx={{ flex: 1, p: 2 }}>
            <AddParcelView
              polygonPoints={cropfield.polygonPoints}
              markerPosition={cropfield.markerPosition}
              uid={cropfield.uid}
              mapHeight={700}
              parcelPolygonPoints={newFieldParcel.polygonPoints}
              polygonColor={newFieldParcel.polygonColor}
              onParcelAdded={handleFieldParcelPolygonCreated}
              onParcelUpdated={handleFieldParcelPolygonUpdated}
              onParcelDeleted={handleFieldParcelPolygonDeleted}
              fieldParcels={fieldParcels}
              allowCreate={true}
              allowDelete={true}
              rowDistance={newFieldParcel.layoutParameters.bedSpacing}
              numberOfRows={newFieldParcel.layoutParameters.numberOfRows}
            />
          </Box>
          <Box sx={{ flex: 1, p: 2, height: 700 }}>
            <form
              onSubmit={handleSubmit}
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
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
              <Typography
                variant="subtitle1"
                sx={{ mt: 2, mb: 1, fontWeight: "bold", fontStyle: "italic" }}
              >
                Select Overlay Color
              </Typography>

              <ChromePicker
                color={newFieldParcel.polygonColor}
                onChangeComplete={(color) => changeOverlayColor(color)}
              />

              <FormControl sx={{ mt: 2, mb: 2, width: 200 }}>
                <InputLabel
                  color="success"
                  id="layout-type-lavel"
                  sx={{ mt: 2 }}
                >
                  Layout Type
                </InputLabel>
                <Select
                  color="success"
                  labelId="layout-type-label"
                  label="Layout type"
                  value={newFieldParcel.layoutType}
                  onChange={handleLayoutChange}
                  sx={{ mt: 2, mb: 2 }}
                >
                  <MenuItem value={LayoutTypes.SingleRow}>Single-Row</MenuItem>
                  <MenuItem value={LayoutTypes.TwinRow}>Twin-Row</MenuItem>
                </Select>
              </FormControl>

              <TextField
                color="success"
                name="numberOfRows"
                type="number"
                label="Number of Rows"
                onChange={handleLayoutParamsChange}
                sx={{ mb: 1 }}
              />

              <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
                <TextField
                  color="success"
                  name="bedSpacing"
                  type="number"
                  label="Bed Spacing(cm)"
                  onChange={handleLayoutParamsChange}
                />
                <TextField
                  color="success"
                  name="cropSpacing"
                  type="number"
                  label="Crop Spacing(cm)"
                  onChange={handleLayoutParamsChange}
                />
              </Box>

              <Box
                sx={{
                  mt: "auto",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  type="submit"
                  disabled={isPending}
                  variant="contained"
                  color="success"
                  sx={{ mt: 3 }}
                >
                  {isPending ? "Creating..." : "Create Field Parcel"}
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default CreateFieldParcelForm;
