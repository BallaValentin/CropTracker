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
import {
  getGeneratedRows,
  getNumberOfCrops,
} from "../../utils/GenerateShapesUtil";
import type { UpdateFieldParcelDTO } from "../../interfaces/request/UpdateFieldParcelDTO";
import PastelColorPicker from "../color-pickers/PastelColorPicker";
import { useTranslation } from "react-i18next";

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
  const { i18n, t } = useTranslation();

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
      numberOfCrops: fieldParcelToUpdate?.layoutParameters.numberOfCrops || 0,
      rowWidth:
        fieldParcelToUpdate?.layoutParameters.linesPerRow || cropWidthCm + 20,
    },
  });

  const [rows, setRows] = useState<LatLngObject[][]>([]);
  const [targetRowCount, setTargetRowCount] = useState<number>(
    newFieldParcel.layoutParameters.numberOfRows || 0,
  );

  const getSafeLanguage = () => {
    const lang = i18n.resolvedLanguage || i18n.language;
    return lang ? lang.split("-")[0] : "en";
  };

  const [currentLanguage, setCurrentLanguage] =
    useState<string>(getSafeLanguage);

  useEffect(() => {
    if (cropfield.uid) {
      setNewFieldParcel((prev) => ({
        ...prev,
        cropFieldId: cropfield.uid,
      }));
    }
  }, [cropfield.uid]);

  useEffect(() => {
    setCurrentLanguage(i18n.language.split("-")[0]);
  }, [i18n]);

  useEffect(() => {
    const generatedRows =
      getGeneratedRows({
        polygonCoords: newFieldParcel.polygonPoints,
        referenceRow: newFieldParcel.layoutParameters.referenceRow,
        numberOfRows: targetRowCount,
        rowDistance:
          newFieldParcel.layoutParameters.bedSpacing +
          newFieldParcel.layoutParameters.rowWidth,
      }) || [];
    setRows(generatedRows);

    const numberOfCrops = getNumberOfCrops({
      rows: generatedRows,
      rowWidth: newFieldParcel.layoutParameters.rowWidth,
      rowMargin: newFieldParcel.layoutParameters.marginSpacing,
      rowSpacing: newFieldParcel.layoutParameters.rowSpacing,
      cropSpacing: newFieldParcel.layoutParameters.plantSpacing,
    });

    setNewFieldParcel((prev) => ({
      ...prev,
      layoutParameters: {
        ...prev.layoutParameters,
        numberOfRows: generatedRows.length,
        numberOfCrops: numberOfCrops,
      },
    }));
  }, [
    newFieldParcel.polygonPoints,
    newFieldParcel.layoutParameters.referenceRow,
    targetRowCount,
    newFieldParcel.layoutParameters.bedSpacing,
    newFieldParcel.layoutParameters.rowWidth,
    newFieldParcel.layoutParameters.marginSpacing,
    newFieldParcel.layoutParameters.rowSpacing,
    newFieldParcel.layoutParameters.plantSpacing,
  ]);

  useEffect(() => {
    if (fieldParcelToUpdate) {
      setNewFieldParcel({
        ...fieldParcelToUpdate,
        cropFieldId: cropfield.uid,
        cropCultivarId: fieldParcelToUpdate.cultivarId,

        layoutParameters: {
          ...fieldParcelToUpdate.layoutParameters,
        },
      });
    }
  }, [fieldParcelToUpdate, cropfield]);

  const { data: crops } = useCropSearch(searchTerm, currentLanguage);

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
      layoutParameters: {
        ...prev.layoutParameters,
        referenceRow: [],
      },
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

    setNewFieldParcel((prev) => {
      return {
        ...prev,
        layoutParameters: {
          ...nextParams,
          rowWidth: newRowWidth,
        },
      };
    });
  };

  const handleRowCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const numericValue = Number.isInteger(Number(value)) ? Number(value) : 0;
    setTargetRowCount(numericValue);
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
          {t("elements.forms.addFieldParcelForm.formTitle") ||
            "Add Field Parcel"}
        </Typography>
        <Box sx={{ display: "flex", height: "100%" }}>
          <Box sx={{ flex: 1, p: 2 }}>
            <AddParcelView
              mapHeight={700}
              polygonPoints={cropfield.polygonPoints}
              markerPosition={cropfield.markerPosition}
              uid={cropfield.uid}
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
              rows={rows}
            />
          </Box>
          <Box
            sx={{
              flex: 1,
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Autocomplete
                options={crops || []}
                value={
                  fieldParcelToUpdate
                    ? {
                        uid: fieldParcelToUpdate.cultivarId,
                        specieId: fieldParcelToUpdate.specieId,
                        cultivarName: fieldParcelToUpdate.cultivarName,
                        specieName: fieldParcelToUpdate.specieName,
                      }
                    : null
                }
                isOptionEqualToValue={(option, value) =>
                  option.uid === value.uid
                }
                getOptionLabel={(option) =>
                  `${option.specieName[currentLanguage] || option.specieName["en"]} - ${option.cultivarName}`
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
                    label={
                      t(
                        "elements.forms.addFieldParcelForm.searchCultivarLabel",
                      ) || "Search Crop Cultivar"
                    }
                  />
                )}
              />

              <PastelColorPicker
                color={newFieldParcel.polygonColor}
                onColorChange={handleColorChange}
              />

              <FormControl sx={{ mt: 2, mb: 2, width: "100%" }}>
                <InputLabel color="success" id="layout-type-lavel">
                  {t("elements.forms.addFieldParcelForm.layoutTypeLabel") ||
                    "Layout Type"}
                </InputLabel>
                <Select
                  color="success"
                  labelId="layout-type-label"
                  label={
                    t("elements.forms.addFieldParcelForm.layoutTypeLabel") ||
                    "Layout Type"
                  }
                  value={newFieldParcel.layoutType}
                  onChange={handleLayoutChange}
                >
                  <MenuItem value={LayoutTypes.SingleRow}>
                    {t("elements.forms.addFieldParcelForm.singleRowOption") ||
                      "Single-Row"}
                  </MenuItem>
                  <MenuItem value={LayoutTypes.MultiRow}>
                    {t("elements.forms.addFieldParcelForm.multiRowOption") ||
                      "Multi-Row"}
                  </MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  color="success"
                  name="targetRowCount"
                  type="number"
                  label={
                    t("elements.forms.addFieldParcelForm.numberOfRows") ||
                    "Number Of Rows"
                  }
                  value={newFieldParcel.layoutParameters.numberOfRows}
                  onChange={handleRowCountChange}
                />

                {newFieldParcel.layoutType === LayoutTypes.MultiRow && (
                  <TextField
                    color="success"
                    name="linesPerRow"
                    type="number"
                    label={
                      t("elements.forms.addFieldParcelForm.linesPerRow") ||
                      "Lines Per Row"
                    }
                    value={newFieldParcel.layoutParameters.linesPerRow}
                    onChange={handleLayoutParamsChange}
                  />
                )}

                <TextField
                  color="success"
                  name="bedSpacing"
                  type="number"
                  label={
                    t("elements.forms.addFieldParcelForm.bedSpacing") ||
                    "Bed Spacing(cm)"
                  }
                  value={newFieldParcel.layoutParameters.bedSpacing}
                  onChange={handleLayoutParamsChange}
                />

                {newFieldParcel.layoutType === LayoutTypes.MultiRow && (
                  <TextField
                    color="success"
                    name="rowSpacing"
                    type="number"
                    label={
                      t("elements.forms.addFieldParcelForm.rowsDistance") ||
                      "Rows Distance(cm)"
                    }
                    value={newFieldParcel.layoutParameters.rowSpacing}
                    onChange={handleLayoutParamsChange}
                  />
                )}

                <TextField
                  color="success"
                  name="plantSpacing"
                  type="number"
                  label={
                    t("elements.forms.addFieldParcelForm.cropSpacing") ||
                    "Crop Spacing(cm)"
                  }
                  value={newFieldParcel.layoutParameters.plantSpacing}
                  onChange={handleLayoutParamsChange}
                />
                <TextField
                  color="success"
                  name="marginSpacing"
                  type="number"
                  label={
                    t("elements.forms.addFieldParcelForm.rowMargin") ||
                    "Row Margins(cm)"
                  }
                  value={newFieldParcel.layoutParameters.marginSpacing}
                  onChange={handleLayoutParamsChange}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Typography variant="caption">
                  {t("elements.forms.addFieldParcelForm.numberOfCrops") ||
                    "Number of Crops: "}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "600" }}>
                  {newFieldParcel.layoutParameters.numberOfCrops}
                </Typography>
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
                  {isPending
                    ? t(
                        "elements.forms.addFieldParcelForm.saveButtonPending",
                      ) || "Saving Field Parcel..."
                    : t("elements.forms.addFieldParcelForm.saveButton") ||
                      "Save Field Parcel"}
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
