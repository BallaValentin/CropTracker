import {
  Box,
  Button,
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
import SimpleTypeList from "../dynamicLists/SimpleTypeList";
import type { CreateFieldWorkDTO } from "../../interfaces/request/CreateFieldWorkDTO";

interface AddFieldWorkFormProps {
  cropField: GetCropFieldDTO;
  fieldParcels: GetFieldParcelDTO[];
  workTypes: GetWorkTypeDTO[];
  onSubmit: (createFieldWorkDTO: CreateFieldWorkDTO) => void;
  isPending: boolean;
}

function AddFieldWorkForm({
  cropField,
  fieldParcels,
  workTypes,
  onSubmit,
  isPending,
}: AddFieldWorkFormProps) {
  const [rowRanges, setRowRanges] = useState<[number, number][]>([]);
  const [currentWorkTypeIndex, setCurrentWorkTypeIndex] = useState<number>(0);
  const [activeFields, setActiveFields] = useState<FieldDefinition[]>(
    workTypes[0].fieldDefinitions || [],
  );

  const toDateTimeLocal = (date: Date): string => {
    const pad = (num: number) => num.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate(),
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}:00Z`;
  };

  const [createFieldWorkDTO, setCreateFieldWorkDTO] =
    useState<CreateFieldWorkDTO>({
      cropFieldId: cropField.uid,
      fieldParcelIds: fieldParcels.map((parcel) => parcel.uid),
      workTypeId: workTypes[0].uid,
      startDate: toDateTimeLocal(new Date()),
      endDate: toDateTimeLocal(new Date()),
      workTiming: "Scheduled",
      affectedRows: [],
      parameters: {},
    });

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
    setCreateFieldWorkDTO((prev) => ({
      ...prev,
      affectedRows: Array(totalRows).fill(false),
    }));
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
    setCreateFieldWorkDTO((prev) => ({
      ...prev,
      parameters: initialWorkParameters,
    }));
  }, [activeFields]);

  const handleParcelSelect = (index: number, checked: boolean) => {
    const updatedRows = [...createFieldWorkDTO.affectedRows];

    if (rowRanges[index]) {
      const [start, end] = rowRanges[index];

      for (let i = start; i < end; i++) {
        updatedRows[i] = checked;
      }

      setCreateFieldWorkDTO((prev) => ({
        ...prev,
        affectedRows: updatedRows,
      }));
    }
  };

  const handleRowClick = (rowIndex: number) => {
    const newAffectedRow = [...createFieldWorkDTO.affectedRows];
    newAffectedRow[rowIndex] = !createFieldWorkDTO.affectedRows[rowIndex];
    setCreateFieldWorkDTO((prev) => ({
      ...prev,
      affectedRows: newAffectedRow,
    }));
  };

  const handleWorkTypeChange = (event: SelectChangeEvent<number | "">) => {
    if (event.target.value !== "") {
      const index = event.target.value;
      setCreateFieldWorkDTO((prev) => ({
        ...prev,
        workTypeId: workTypes[index].uid,
      }));
      setCurrentWorkTypeIndex(index);
      setActiveFields(workTypes[index].fieldDefinitions);
    }
  };

  const handleWorkTimingChange = (event: SelectChangeEvent) => {
    setCreateFieldWorkDTO((prev) => ({
      ...prev,
      workTiming: event.target.value,
    }));
  };

  const handleWorkParametersTextfieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    setCreateFieldWorkDTO((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWorkParametersSelectChange = (
    fieldName: string,
    event: SelectChangeEvent,
  ) => {
    const { value } = event.target;

    setCreateFieldWorkDTO((prev) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [fieldName]: value,
      },
    }));
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCreateFieldWorkDTO((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddEntry = (field: FieldDefinition) => {
    if (Array.isArray(createFieldWorkDTO.parameters[field.name])) {
      let updatedEntries: StringNumber[] | string[] | number[];

      if (field.type === "stringNumber[]") {
        const entries = createFieldWorkDTO.parameters[
          field.name
        ] as StringNumber[];
        const hasEmptyEntry = entries.some(
          (entry) => entry.numberValue === 0 && entry.textValue.trim() === "",
        );

        updatedEntries = hasEmptyEntry
          ? [...entries]
          : [...entries, { textValue: "", numberValue: 0 }];
      } else if (field.type === "string[]") {
        const entries = createFieldWorkDTO.parameters[field.name] as string[];
        const hasEmptyEntry = entries.some((entry) => entry.trim() === "");
        updatedEntries = hasEmptyEntry ? [...entries] : [...entries, ""];
      } else {
        const entries = createFieldWorkDTO.parameters[field.name] as number[];
        const hasEmptyEntry = entries.some((entry) => entry === null);
        updatedEntries = hasEmptyEntry ? [...entries] : [...entries, 0];
      }

      setCreateFieldWorkDTO((prev) => ({
        ...prev,
        parameters: {
          ...prev.parameters,
          [field.name]: updatedEntries,
        },
      }));
    }
  };

  const handleEntryChange = (
    field: FieldDefinition,
    index: number,
    updatedEntry: StringNumber | string | number,
  ) => {
    if (Array.isArray(createFieldWorkDTO.parameters[field.name])) {
      let updatedEntries: StringNumber[] | string[] | number[];
      if (field.type === "stringNumber[]") {
        const entries = createFieldWorkDTO.parameters[
          field.name
        ] as StringNumber[];
        const item = updatedEntry as StringNumber;
        updatedEntries = entries.map((entry, i) =>
          i === index ? { ...item } : entry,
        );
      } else if (field.type === "string[]") {
        const entries = createFieldWorkDTO.parameters[field.name] as string[];
        const item = updatedEntry as string;
        updatedEntries = entries.map((entry, i) =>
          i === index ? item : entry,
        );
      } else {
        const entries = createFieldWorkDTO.parameters[field.name] as number[];
        const item = updatedEntry as number;
        updatedEntries = entries.map((entry, i) =>
          i === index ? item : entry,
        );
      }

      setCreateFieldWorkDTO((prev) => ({
        ...prev,
        parameters: {
          ...prev.parameters,
          [field.name]: updatedEntries,
        },
      }));
    }
  };

  const handleEntryRemoved = (field: FieldDefinition, index: number) => {
    if (Array.isArray(createFieldWorkDTO.parameters[field.name])) {
      let updatedEntries: StringNumber[] | string[] | number[];

      if (field.type === "stringNumber[]") {
        const entries = createFieldWorkDTO.parameters[
          field.name
        ] as StringNumber[];
        updatedEntries = entries.filter((_, i) => i !== index);

        if (updatedEntries.length === 0) {
          updatedEntries.push({ textValue: "", numberValue: 0 });
        }
      } else if (field.type === "string[]") {
        const entries = createFieldWorkDTO.parameters[field.name] as string[];
        updatedEntries = entries.filter((_, i) => i !== index);

        if (updatedEntries.length === 0) {
          updatedEntries.push("");
        }
      } else {
        const entries = createFieldWorkDTO.parameters[field.name] as number[];
        updatedEntries = entries.filter((_, i) => i !== index);

        if (updatedEntries.length === 0) {
          updatedEntries.push(0);
        }
      }

      setCreateFieldWorkDTO((prev) => ({
        ...prev,
        parameters: {
          ...prev.parameters,
          [field.name]: updatedEntries,
        },
      }));
    }
  };

  const handleWorkSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(createFieldWorkDTO);
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
                  value={createFieldWorkDTO.workTiming}
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
                display: "flex",
                gap: 20,
              }}
            >
              <TextField
                sx={{ flex: 1 }}
                label="Select starting Date and Time"
                name="startDate"
                color="success"
                type="datetime-local"
                required
                value={createFieldWorkDTO.startDate.slice(0, 16)}
                defaultValue="2026-01-01T12:00"
                onChange={handleDateChange}
                fullWidth
              />

              {createFieldWorkDTO.workTiming === "Past" ? (
                <TextField
                  sx={{ flex: 1 }}
                  label="Select ending Date and Time"
                  value={createFieldWorkDTO.endDate?.slice(0, 16)}
                  name="endDate"
                  color="success"
                  type="datetime-local"
                  defaultValue="2026-01-01T12:00"
                  onChange={handleDateChange}
                  fullWidth
                />
              ) : (
                <Box sx={{ flex: 1, display: "block" }} />
              )}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 3,
            minWidth: 400,
            maxWidth: 800,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          {activeFields.map((field) => (
            <Box>
              {field.type === "string" && (
                <Box sx={{ width: 400 }}>
                  <FormControl fullWidth variant="outlined">
                    <TextField
                      label={field.name}
                      color="success"
                      type="string"
                      onChange={handleWorkParametersTextfieldChange}
                    />
                  </FormControl>
                </Box>
              )}

              {field.type === "number" && (
                <Box sx={{ width: 400 }}>
                  <FormControl fullWidth variant="outlined">
                    <TextField
                      label={field.name}
                      color="success"
                      type="number"
                      onChange={handleWorkParametersTextfieldChange}
                    />
                  </FormControl>
                </Box>
              )}

              {field.type === "select" && (
                <Box sx={{ width: 400 }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel
                      id={`${field.name}-select-label`}
                      color="success"
                    >
                      {field.name}
                    </InputLabel>
                    <Select
                      labelId={`${field.name}-select-label`}
                      id={`${field.name}-select`}
                      label={field.name}
                      color="success"
                      value={createFieldWorkDTO.parameters[field.name] || ""}
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
                </Box>
              )}

              {field.type === "stringNumber[]" && (
                <Box sx={{ width: 800 }}>
                  <StringNumberList
                    entries={
                      (createFieldWorkDTO.parameters[
                        field.name
                      ] as StringNumber[]) || []
                    }
                    field={field}
                    onNewEntryAdded={handleAddEntry}
                    onEntryChange={handleEntryChange}
                    onEntryRemoved={handleEntryRemoved}
                  />
                </Box>
              )}

              {field.type === "string[]" && (
                <Box sx={{ width: 400 }}>
                  <SimpleTypeList
                    entries={
                      (createFieldWorkDTO.parameters[field.name] as string[]) ||
                      []
                    }
                    field={field}
                    onNewEntryAdded={handleAddEntry}
                    onEntryChange={handleEntryChange}
                    onEntryRemoved={handleEntryRemoved}
                  />
                </Box>
              )}

              {field.type === "number[]" && (
                <Box sx={{ width: 400 }}>
                  <SimpleTypeList
                    entries={
                      (createFieldWorkDTO.parameters[field.name] as number[]) ||
                      []
                    }
                    field={field}
                    onNewEntryAdded={handleAddEntry}
                    onEntryChange={handleEntryChange}
                    onEntryRemoved={handleEntryRemoved}
                  />
                </Box>
              )}
            </Box>
          ))}
        </Box>

        <SelectFieldRowsPanel
          cropField={cropField}
          fieldParcels={fieldParcels}
          affectedRows={createFieldWorkDTO.affectedRows}
          onParcelSelect={handleParcelSelect}
          onRowClick={handleRowClick}
        />

        <Button
          type="submit"
          variant="contained"
          color="success"
          sx={{ mt: 3, alignSelf: "flex-end" }}
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save Field Work"}
        </Button>
      </form>
    </Box>
  );
}

export default AddFieldWorkForm;
