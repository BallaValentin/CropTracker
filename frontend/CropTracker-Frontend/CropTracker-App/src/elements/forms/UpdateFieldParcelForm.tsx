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
import { useCropSearch } from "../../hooks/caching/UseCropSearch";
import { useState } from "react";
import AddParcelView from "../../leaflet/view/AddParcelsView";
import { ChromePicker, type ColorResult } from "react-color";
import type { LatLngObject } from "../../interfaces/helper/LatLngObject";
import { calculatePolygonArea } from "../../utils/PolygonHelper";
import type { GetFieldParcelDTO } from "../../interfaces/response/GetFieldParcelDTO";
import type { UpdateFieldParcelDTO } from "../../interfaces/request/UpdateFieldParcelDTO";
import { LayoutTypes } from "../../utils/LayoutTypes";
import { calculateRowWidth } from "../../utils/CalculateRowWidth";
import { maxLines } from "../../utils/Constants";
import { getGeneratedRows } from "../../utils/GenerateShapesUtil";

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
      layoutType: fieldParcelToUpdate.layoutType,
      layoutParameters: fieldParcelToUpdate.layoutParameters,
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleFieldParcelPolygonCreated = (_latLngs: LatLngObject[]) => {};

  const handleFieldParcelPolygonDeleted = () => {};

  const handleFieldParcelPolygonUpdated = (latLngs: LatLngObject[]) => {
    setFieldParcelUpdate((prev) => ({
      ...prev,
      polygonPoints: latLngs,
      area: calculatePolygonArea(latLngs),
    }));
  };

  const handleLayoutChange = (event: SelectChangeEvent) => {
    setFieldParcelUpdate((prev) => {
      const layoutParams = prev.layoutParameters;
      const newLayoutType = event.target.value;

      const newRowWidth = calculateRowWidth(layoutParams, newLayoutType, true);

      return {
        ...prev,
        layoutType: newLayoutType,
        layoutParameters: {
          ...layoutParams,
          rowWidth: newRowWidth,
          linesPerRow: 1,
        },
      };
    });
  };

  const handleLayoutParamsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    let numericValue = Number.parseInt(value) || 0;

    if (name === "linesPerRow") {
      numericValue = Math.max(1, Math.min(numericValue, maxLines));
    }

    if (name === "numberOfRows") {
      const actualRows = getGeneratedRows({
        polygonCoords: fieldParcelUpdate.polygonPoints,
        referenceRow: fieldParcelUpdate.layoutParameters.referenceRow,
        numberOfRows: numericValue,
        rowDistance:
          fieldParcelUpdate.layoutParameters.bedSpacing +
          fieldParcelUpdate.layoutParameters.rowWidth,
      });

      if (actualRows && actualRows.length > 0) {
        numericValue = actualRows.length;
      }
    }

    setFieldParcelUpdate((prev) => {
      const layoutType = prev.layoutType;
      const nextParams = { ...prev.layoutParameters, [name]: numericValue };
      const newRowWidth = calculateRowWidth(nextParams, layoutType, false);

      return {
        ...prev,
        layoutParameters: {
          ...nextParams,
          rowWidth: newRowWidth,
        },
      };
    });
  };

  const handleReferenceRowAdded = (referenceRow: LatLngObject[]) => {
    setFieldParcelUpdate((prev) => ({
      ...prev,
      layoutParameters: {
        ...prev.layoutParameters,
        referenceRow: referenceRow,
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
          Update Field Parcel
        </Typography>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ flex: 1, p: 2 }}>
            <AddParcelView
              polygonPoints={cropfield.polygonPoints}
              markerPosition={cropfield.markerPosition}
              uid={cropfield.uid}
              mapHeight={700}
              parcelPolygonPoints={fieldParcelUpdate.polygonPoints}
              polygonColor={fieldParcelUpdate.polygonColor}
              onParcelAdded={handleFieldParcelPolygonCreated}
              onParcelDeleted={handleFieldParcelPolygonDeleted}
              onParcelUpdated={handleFieldParcelPolygonUpdated}
              fieldParcels={fieldParcels}
              allowCreate={false}
              allowDelete={false}
              onReferenceRowAdded={handleReferenceRowAdded}
              layoutParameters={fieldParcelUpdate.layoutParameters}
            />
          </Box>
          <Box sx={{ flex: 1, p: 2 }}>
            <form
              onSubmit={handleSubmit}
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
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
                  value={fieldParcelUpdate.layoutType}
                  onChange={handleLayoutChange}
                  sx={{ mt: 2, mb: 2 }}
                >
                  <MenuItem value={LayoutTypes.SingleRow}>Single-Row</MenuItem>
                  <MenuItem value={LayoutTypes.MultiRow}>Multi-Row</MenuItem>
                </Select>
              </FormControl>

              <TextField
                value={fieldParcelUpdate.layoutParameters.numberOfRows}
                color="success"
                name="numberOfRows"
                type="number"
                label="Number of Rows"
                onChange={handleLayoutParamsChange}
                sx={{ mb: 1 }}
              />

              <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
                {fieldParcelUpdate.layoutType === LayoutTypes.MultiRow && (
                  <TextField
                    color="success"
                    name="linesPerRow"
                    type="number"
                    label="Lines per Row"
                    value={fieldParcelUpdate.layoutParameters.linesPerRow}
                    onChange={handleLayoutParamsChange}
                  />
                )}

                <TextField
                  value={fieldParcelUpdate.layoutParameters.bedSpacing}
                  color="success"
                  name="bedSpacing"
                  type="number"
                  label="Bed Spacing(cm)"
                  onChange={handleLayoutParamsChange}
                />
                {fieldParcelUpdate.layoutType === LayoutTypes.MultiRow && (
                  <TextField
                    value={fieldParcelUpdate.layoutParameters.rowSpacing}
                    color="success"
                    name="rowSpacing"
                    type="number"
                    label="Rows Distance(cm)"
                    onChange={handleLayoutParamsChange}
                  />
                )}
                <TextField
                  value={fieldParcelUpdate.layoutParameters.plantSpacing}
                  color="success"
                  name="plantSpacing"
                  type="number"
                  label="Crop Spacing(cm)"
                  onChange={handleLayoutParamsChange}
                />
                <TextField
                  value={fieldParcelUpdate.layoutParameters.marginSpacing}
                  color="success"
                  name="marginSpacing"
                  type="number"
                  label="Row Margins(cm)"
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
                  {isPending ? "Updating..." : "Update Field Parcel"}
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default UpdateFieldParcelForm;
