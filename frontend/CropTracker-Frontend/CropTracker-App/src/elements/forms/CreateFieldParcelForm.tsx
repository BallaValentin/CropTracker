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
import { useEffect, useState } from "react";
import AddParcelView from "../../leaflet/view/AddParcelsView";
import type { LatLngObject } from "../../interfaces/helper/LatLngObject";
import type { CreateFieldParcelDTO } from "../../interfaces/request/CreateFieldParcelDTO";
import { calculatePolygonArea } from "../../utils/PolygonHelper";
import type { GetFieldParcelDTO } from "../../interfaces/response/GetFieldParcelDTO";
import { LayoutTypes } from "../../utils/LayoutTypes";
import { cropWidthCm, maxLines, PastelPresets } from "../../utils/Constants";
import { calculateRowWidth } from "../../utils/CalculateRowWidth";
import { getGeneratedRows } from "../../utils/GenerateShapesUtil";
import type { UpdateFieldParcelDTO } from "../../interfaces/request/UpdateFieldParcelDTO";
import PastelColorPicker from "../color-pickers/PastelColorPicker";

interface CreateFieldParcelFormProps {
  fieldParcelToUpdate?: GetFieldParcelDTO | null;
  onSubmit: (
    createFieldParcelData: CreateFieldParcelDTO | UpdateFieldParcelDTO,
  ) => void;
  isPending: boolean;
  cropfield: GetCropFieldDTO;
  fieldParcels: GetFieldParcelDTO[];
}

function CreateFieldParcelForm({
  fieldParcelToUpdate = null,
  onSubmit,
  cropfield,
  isPending,
  fieldParcels,
}: CreateFieldParcelFormProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newFieldParcel, setNewFieldParcel] = useState<CreateFieldParcelDTO>({
    cropFieldId: cropfield.uid,
    cropCultivarId: fieldParcelToUpdate?.cultivarId || "",
    area: fieldParcelToUpdate?.area || 0,
    polygonPoints: fieldParcelToUpdate?.polygonPoints || ([] as LatLngObject[]),
    polygonColor: fieldParcelToUpdate?.polygonColor || PastelPresets[0],
    layoutType: fieldParcelToUpdate?.layoutType || LayoutTypes.SingleRow,
    layoutParameters: {
      referenceRow: fieldParcelToUpdate?.layoutParameters.referenceRow || [],
      bedSpacing: fieldParcelToUpdate?.layoutParameters.bedSpacing || 10,
      plantSpacing: fieldParcelToUpdate?.layoutParameters.plantSpacing || 30,
      rowSpacing: fieldParcelToUpdate?.layoutParameters.rowSpacing || 30,
      numberOfRows: fieldParcelToUpdate?.layoutParameters.numberOfRows || 0,
      marginSpacing: fieldParcelToUpdate?.layoutParameters.marginSpacing || 10,
      linesPerRow: fieldParcelToUpdate?.layoutParameters.linesPerRow || 1,
      rowWidth:
        fieldParcelToUpdate?.layoutParameters.linesPerRow || cropWidthCm + 20,
    },
  });

  useEffect(() => {
    if (fieldParcelToUpdate) {
      setNewFieldParcel({
        ...fieldParcelToUpdate,
        cropCultivarId: fieldParcelToUpdate.cultivarId,

        layoutParameters: {
          ...fieldParcelToUpdate.layoutParameters,
        },
      });
    }
  }, [fieldParcelToUpdate]);

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

  const handleColorChange = (color: string) => {
    setNewFieldParcel((prev) => ({
      ...prev,
      polygonColor: color,
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
    setNewFieldParcel((prev) => {
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

    const nextParams = {
      ...newFieldParcel.layoutParameters,
      [name]: numericValue,
    };

    const newRowWidth = calculateRowWidth(
      nextParams,
      newFieldParcel.layoutType,
      false,
    );

    if (name === "linesPerRow") {
      numericValue = Math.max(1, Math.min(numericValue, maxLines));
    }

    const actualRows = getGeneratedRows({
      polygonCoords: newFieldParcel.polygonPoints,
      referenceRow: newFieldParcel.layoutParameters.referenceRow,
      numberOfRows: nextParams.numberOfRows,
      rowDistance: nextParams.bedSpacing + newRowWidth,
    });

    let numberOfRows = nextParams.numberOfRows;
    if (actualRows && actualRows.length > 0) {
      numberOfRows = actualRows.length;
    }

    setNewFieldParcel((prev) => {
      return {
        ...prev,
        layoutParameters: {
          ...nextParams,
          numberOfRows: numberOfRows,
          rowWidth: newRowWidth,
        },
      };
    });
  };

  const handleReferenceRowAdded = (referenceRow: LatLngObject[]) => {
    setNewFieldParcel((prev) => ({
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
          Create or Edit Field Parcel
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
              layoutParameters={newFieldParcel.layoutParameters}
              onReferenceRowAdded={handleReferenceRowAdded}
            />
          </Box>
          <Box
            sx={{
              flex: 1,
              p: 2,
              height: 700,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <form
              onSubmit={handleSubmit}
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Autocomplete
                options={crops || []}
                getOptionLabel={(option) =>
                  `${option.specieName} - ${option.cultivarName}`
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

              <PastelColorPicker
                color={newFieldParcel.polygonColor}
                onColorChange={handleColorChange}
              />

              <FormControl sx={{ mt: 2, mb: 2, width: 200 }}>
                <InputLabel color="success" id="layout-type-lavel">
                  Layout Type
                </InputLabel>
                <Select
                  color="success"
                  labelId="layout-type-label"
                  label="Layout type"
                  value={newFieldParcel.layoutType}
                  onChange={handleLayoutChange}
                >
                  <MenuItem value={LayoutTypes.SingleRow}>Single-Row</MenuItem>
                  <MenuItem value={LayoutTypes.MultiRow}>Multi-Row</MenuItem>
                </Select>
              </FormControl>

              <TextField
                color="success"
                name="numberOfRows"
                type="number"
                label="Number of Rows"
                value={newFieldParcel.layoutParameters.numberOfRows}
                onChange={handleLayoutParamsChange}
              />

              <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
                {newFieldParcel.layoutType === LayoutTypes.MultiRow && (
                  <TextField
                    color="success"
                    name="linesPerRow"
                    type="number"
                    label="Lines per Row"
                    value={newFieldParcel.layoutParameters.linesPerRow}
                    onChange={handleLayoutParamsChange}
                  />
                )}

                <TextField
                  color="success"
                  name="bedSpacing"
                  type="number"
                  label="Bed Spacing(cm)"
                  value={newFieldParcel.layoutParameters.bedSpacing}
                  onChange={handleLayoutParamsChange}
                />

                {newFieldParcel.layoutType === LayoutTypes.MultiRow && (
                  <TextField
                    color="success"
                    name="rowSpacing"
                    type="number"
                    label="Rows Distance(cm)"
                    value={newFieldParcel.layoutParameters.rowSpacing}
                    onChange={handleLayoutParamsChange}
                  />
                )}

                <TextField
                  color="success"
                  name="plantSpacing"
                  type="number"
                  label="Crop Spacing(cm)"
                  value={newFieldParcel.layoutParameters.plantSpacing}
                  onChange={handleLayoutParamsChange}
                />
                <TextField
                  color="success"
                  name="marginSpacing"
                  type="number"
                  label="Row Margins(cm)"
                  value={newFieldParcel.layoutParameters.marginSpacing}
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
                >
                  {isPending ? "Saving..." : "Save Field Parcel"}
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
