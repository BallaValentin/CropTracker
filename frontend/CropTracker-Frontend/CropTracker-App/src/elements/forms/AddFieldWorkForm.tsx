import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import type { GetCropFieldDTO } from "../../interfaces/response/GetCropFieldDTO";
import type { GetFieldParcelDTO } from "../../interfaces/response/GetFieldParcelDTO";
import { useEffect, useState } from "react";
import type { GetWorkTypeDTO } from "../../interfaces/response/GetWorkTypeDTO";
import type { FieldDefinition } from "../../interfaces/FieldDefinition";
import type { StringNumber } from "../../interfaces/StringNumber";
import StringNumberList from "../dynamicLists/StringNumberList";
import SelectFieldRowsPanel from "../panels/SelectFieldRowsPanel";

interface AddFieldWorkFormProps {
  cropField: GetCropFieldDTO;
  fieldParcels: GetFieldParcelDTO[];
  workTypes: GetWorkTypeDTO[];
}

function AddFieldWorkForm({
  cropField,
  fieldParcels,
  workTypes,
}: AddFieldWorkFormProps) {
  const [affectedRows, setAffectedRows] = useState<boolean[]>([]);
  const [rowRanges, setRowRanges] = useState<[number, number][]>([]);
  const [currentWorkTypeIndex, setCurrentWorkTypeIndex] = useState<number>(0);
  const [workTiming, setWorkTiming] = useState<string>("Scheduled");
  const [activeFields, setActiveFields] = useState<FieldDefinition[]>(
    workTypes[0].fieldDefinitions || [],
  );
  const [workParameters, setWorkParameters] = useState<
    Record<string, string | number | string[] | number[] | StringNumber[]>
  >({});

  useEffect(() => {
    let totalRows = 0;
    const newRowRanges: [number, number][] = [];
    fieldParcels.forEach((parcel) => {
      const minRange = totalRows;
      totalRows += parcel.layoutParameters.numberOfRows;
      const maxRange = totalRows;
      newRowRanges.push([minRange, maxRange]);
    });
    setRowRanges(newRowRanges);
    setAffectedRows(Array(totalRows).fill(false));
  }, [fieldParcels]);

  useEffect(() => {
    const initialWorkParameters = activeFields.reduce<
      Record<string, string | number | string[] | number[] | StringNumber[]>
    >((acc, field) => {
      if (field.type === "stringNumber[]") {
        acc[field.name] = [{ textValue: "", numberValue: 0 }];
      } else if (field.type === "string[]") {
        acc[field.name] = [""];
      } else if (field.type === "number[]") {
        acc[field.name] = [0];
      } else if (field.type === "string") {
        acc[field.name] = "";
      } else if (field.type === "number") {
        acc[field.name] = 0;
      } else if (field.type === "select") {
        acc[field.name] = field.options[0] || "";
      } else {
        acc[field.name] = "";
      }

      return acc;
    }, {});
    setWorkParameters(initialWorkParameters);
  }, [activeFields]);

  const handleParcelSelect = (index: number, checked: boolean) => {
    const updatedRows = [...affectedRows];

    if (rowRanges[index]) {
      const [start, end] = rowRanges[index];

      for (let i = start; i < end; i++) {
        updatedRows[i] = checked;
      }

      setAffectedRows(updatedRows);
    }
  };

  const handleRowClick = (rowIndex: number) => {
    const newAffectedRow = [...affectedRows];
    newAffectedRow[rowIndex] = !affectedRows[rowIndex];
    setAffectedRows(newAffectedRow);
  };

  const handleWorkTypeChange = (event: SelectChangeEvent<number | "">) => {
    if (event.target.value !== "") {
      const index = event.target.value;
      setCurrentWorkTypeIndex(index);
      setActiveFields(workTypes[index].fieldDefinitions);
    }
  };

  const handleWorkTimingChange = (event: SelectChangeEvent) => {
    setWorkTiming(event.target.value);
  };

  const handleWorkParametersTextfieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    setWorkParameters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWorkParametersSelectChange = (
    fieldName: string,
    event: SelectChangeEvent,
  ) => {
    const { value } = event.target;
    console.log(`New select value: ${value}`);
    setWorkParameters((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleAddStringNumber = (field: FieldDefinition) => {
    if (Array.isArray(workParameters[field.name])) {
      const currentEntries = workParameters[field.name] as StringNumber[];

      if (field.type === "stringNumber[]") {
        const hasEmptyEntry = currentEntries.some(
          (entry) => entry.numberValue === 0 && entry.textValue.trim() === "",
        );

        if (hasEmptyEntry) return;

        setWorkParameters((prev) => ({
          ...prev,
          [field.name]: [...currentEntries, { textValue: "", numberValue: 0 }],
        }));
      }
    }
  };

  const handleNumberChange = (
    field: FieldDefinition,
    index: number,
    newValue: number,
  ) => {
    if (
      Array.isArray(workParameters[field.name]) &&
      field.type === "stringNumber[]"
    ) {
      const currentEntries = workParameters[field.name] as StringNumber[];
      const updatedEntries = currentEntries.map((entry, i) =>
        i === index ? { ...entry, numberValue: newValue } : entry,
      );

      setWorkParameters((prev) => ({
        ...prev,
        [field.name]: [...updatedEntries],
      }));
    }
  };

  const handleStringChange = (
    field: FieldDefinition,
    index: number,
    newValue: string,
  ) => {
    if (
      Array.isArray(workParameters[field.name]) &&
      field.type === "stringNumber[]"
    ) {
      const currentEntries = workParameters[field.name] as StringNumber[];

      const updatedEntries = currentEntries.map((entry, i) =>
        i === index ? { ...entry, textValue: newValue } : entry,
      );

      setWorkParameters((prev) => ({
        ...prev,
        [field.name]: [...updatedEntries],
      }));
    }
  };

  const handleWorkSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <Box>
      <form onSubmit={handleWorkSubmit}>
        <Typography
          variant="h4"
          component={"h1"}
          sx={{
            mt: 3,
            mb: 2,
            fontWeight: "bold",
            color: "success.main",
            letterSpacing: "0.02em",
          }}
        >
          Add Field Work
        </Typography>

        <Box sx={{ border: "1px solid lightgray", borderRadius: 2, p: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Field Work Categorization & Schedule
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mt: 0.5 }}
            >
              Define the type of field work being performed and set the
              operational timeframe.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box
              sx={{
                minWidth: 200,
                maxWidth: 400,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <FormControl fullWidth variant="outlined">
                <InputLabel id="worktype-select-label" color="success">
                  Work Type
                </InputLabel>
                <Select
                  labelId="worktype-select-label"
                  id="worktype-select"
                  label="Work Type"
                  value={currentWorkTypeIndex}
                  onChange={handleWorkTypeChange}
                  color="success"
                >
                  {workTypes.map((workType, index) => (
                    <MenuItem key={workType.uid} value={index}>
                      {workType.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <InputLabel id="worktiming-select-label" color="success">
                  Work Timing
                </InputLabel>
                <Select
                  labelId="worktiming-select-label"
                  id="worktiming-select"
                  label="Work Timing"
                  value={workTiming}
                  onChange={handleWorkTimingChange}
                  color="success"
                >
                  <MenuItem value="Scheduled">Scheduled Work</MenuItem>
                  <MenuItem value="Past">Past Work</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box
              sx={{
                mt: 2,
                maxWidth: 400,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TextField
                label="Select starting Date and Time"
                color="success"
                type="datetime-local"
                defaultValue="2026-01-01T12:00"
                fullWidth
              />

              {workTiming === "Past" ? (
                <TextField
                  label="Select ending Date and Time"
                  color="success"
                  type="datetime-local"
                  defaultValue="2026-01-01T12:00"
                  fullWidth
                />
              ) : (
                <Box sx={{ maxWidth: 400, flex: 1, display: "block" }} />
              )}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 3,
            minWidth: 200,
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          {activeFields.map((field) => (
            <Box>
              {field.type === "string" && (
                <FormControl fullWidth variant="outlined">
                  <TextField
                    label={field.name}
                    color="success"
                    type="string"
                    fullWidth
                    onChange={handleWorkParametersTextfieldChange}
                  />
                </FormControl>
              )}

              {field.type === "number" && (
                <FormControl fullWidth variant="outlined">
                  <TextField label={field.name} color="success" type="number" />
                </FormControl>
              )}

              {field.type === "select" && (
                <FormControl fullWidth variant="outlined">
                  <InputLabel id={`${field.name}-select-label`} color="success">
                    {field.name}
                  </InputLabel>
                  <Select
                    labelId={`${field.name}-select-label`}
                    id={`${field.name}-select`}
                    label={field.name}
                    color="success"
                    value={workParameters[field.name] || ""}
                    onChange={(e) =>
                      handleWorkParametersSelectChange(
                        field.name,
                        e as SelectChangeEvent<string>,
                      )
                    }
                  >
                    {field.options.map((option) => (
                      <MenuItem value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {field.type === "stringNumber[]" && (
                <StringNumberList
                  entries={(workParameters[field.name] as StringNumber[]) || []}
                  field={field}
                  onNewEntryAdded={handleAddStringNumber}
                  onEntryTextChange={handleStringChange}
                  onEntryNumberChange={handleNumberChange}
                />
              )}
            </Box>
          ))}
        </Box>

        <SelectFieldRowsPanel
          cropField={cropField}
          fieldParcels={fieldParcels}
          affectedRows={affectedRows}
          onParcelSelect={handleParcelSelect}
          onRowClick={handleRowClick}
        />
      </form>
    </Box>
  );
}

export default AddFieldWorkForm;
