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
import type { FieldDefinition } from "../../interfaces/helper/FieldDefinition";
import type { StringNumber } from "../../interfaces/helper/StringNumber";
import StringNumberList from "../dynamicLists/StringNumberList";
import SelectFieldRowsPanel from "../panels/SelectFieldRowsPanel";
import SimpleTypeList from "../dynamicLists/SimpleTypeList";
import type { CreateFieldWorkDTO } from "../../interfaces/request/CreateFieldWorkDTO";
import { getPreviousWorks } from "../../services/FieldWorkService";
import { useMutation } from "@tanstack/react-query";
import AddIcon from "@mui/icons-material/Add";
import AddNewWorkTypeDialog from "../dialogs/AddNewWorkTypeDialog";
import type { CreateWorkTypeDTO } from "../../interfaces/request/CreateWorkTypeDTO";
import type { GetFieldWorkDTO } from "../../interfaces/response/GetFieldWorkDTO";
import type { UpdateFieldWorkDTO } from "../../interfaces/request/UpdateFieldWorkDTO";
import type { GetPreviousWorkDTO } from "../../interfaces/response/GetPreviousWorkDTO";

interface AddFieldWorkFormProps {
  fieldWorkToUpdate?: GetFieldWorkDTO | null;
  cropField: GetCropFieldDTO;
  fieldParcels: GetFieldParcelDTO[];
  workTypes: GetWorkTypeDTO[];
  onSubmit: (
    createFieldWorkDTO: CreateFieldWorkDTO | UpdateFieldWorkDTO,
  ) => void;
  onWorkTypeAdded: (createWorkTypeDTO: CreateWorkTypeDTO) => void;
  isPending: boolean;
}

function AddFieldWorkForm({
  fieldWorkToUpdate = null,
  cropField,
  fieldParcels,
  workTypes,
  onSubmit,
  onWorkTypeAdded,
  isPending,
}: AddFieldWorkFormProps) {
  const [rowRanges, setRowRanges] = useState<[number, number][]>([]);
  const [previousWorks, setPreviousWorks] = useState<GetPreviousWorkDTO[]>([]);
  const [currentWorkTypeIndex, setCurrentWorkTypeIndex] = useState<number>(
    () => {
      if (workTypes && fieldWorkToUpdate?.workTypeId) {
        return workTypes.findIndex(
          (workType) => workType.uid === fieldWorkToUpdate.workTypeId,
        );
      }
      return 0;
    },
  );

  const [activeFields, setActiveFields] = useState<FieldDefinition[]>(
    workTypes?.[currentWorkTypeIndex]?.fieldDefinitions || [],
  );

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

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
      workTypeId: fieldWorkToUpdate?.workTypeId || workTypes[0].uid,
      startDate: fieldWorkToUpdate?.startDate || toDateTimeLocal(new Date()),
      endDate: fieldWorkToUpdate?.endDate || "",
      workTiming: fieldWorkToUpdate?.workTiming || "Scheduled",
      affectedRows: fieldWorkToUpdate?.affectedRows || [],
      parameters: fieldWorkToUpdate?.parameters || {},
    });

  const { mutate } = useMutation({
    mutationFn: ({
      cropFieldId,
      numberOfDays,
      referenceDate,
      selectedWorkTypes,
    }: {
      cropFieldId: string;
      numberOfDays: number;
      referenceDate: string;
      selectedWorkTypes: string[];
    }) =>
      getPreviousWorks(
        cropFieldId,
        numberOfDays,
        referenceDate,
        selectedWorkTypes,
      ),
    onSuccess: (response: GetPreviousWorkDTO[]) => {
      setPreviousWorks(response);
    },
  });

  const handleRowsSearch = (days: number, selectedWorkTypes: string[]) => {
    mutate({
      cropFieldId: cropField.uid,
      numberOfDays: days,
      referenceDate: createFieldWorkDTO.startDate,
      selectedWorkTypes: selectedWorkTypes,
    });
  };

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

    if (!fieldWorkToUpdate) {
      setCreateFieldWorkDTO((prev) => ({
        ...prev,
        affectedRows: Array(totalRows).fill(false),
      }));
    }
  }, [fieldParcels, fieldWorkToUpdate]);

  const getEmptyWorkParameters = () => {
    return activeFields.reduce<
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
  };

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
      setCurrentWorkTypeIndex(index);
      setActiveFields(workTypes[index].fieldDefinitions);

      setCreateFieldWorkDTO((prev) => ({
        ...prev,
        workTypeId: workTypes[index].uid,
        parameters: { ...getEmptyWorkParameters },
      }));
    }
  };

  const handleWorkTimingChange = (event: SelectChangeEvent) => {
    const newWorkTiming = event.target.value;

    if (newWorkTiming === "Past") {
      setCreateFieldWorkDTO((prev) => ({
        ...prev,
        endDate: toDateTimeLocal(new Date()),
      }));
    } else {
      setCreateFieldWorkDTO((prev) => ({
        ...prev,
        endDate: "",
      }));
    }
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
      parameters: {
        ...prev.parameters,
        [name]: value,
      },
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
      [name]: value + ":00Z",
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

  const handleAddWorkType = (event: React.MouseEvent<HTMLLIElement>) => {
    event.stopPropagation();
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogConfirm = (createWorkTypeDTO: CreateWorkTypeDTO) => {
    onWorkTypeAdded(createWorkTypeDTO);
    setDialogOpen(false);
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
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  }}
                >
                  {workTypes.map((workType, index) => (
                    <MenuItem key={workType.uid} value={index}>
                      {workType.name}
                    </MenuItem>
                  ))}

                  <MenuItem
                    onClickCapture={handleAddWorkType}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <AddIcon />
                    <Typography>Add new work type</Typography>
                  </MenuItem>
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
                value={
                  createFieldWorkDTO.startDate.slice(0, 16) ||
                  "2026-01-01T12:00"
                }
                onChange={handleDateChange}
                fullWidth
              />

              {createFieldWorkDTO.workTiming === "Past" ? (
                <TextField
                  sx={{ flex: 1 }}
                  label="Select ending Date and Time"
                  value={
                    createFieldWorkDTO.endDate?.slice(0, 16) ||
                    "2026-01-01T12:00"
                  }
                  name="endDate"
                  color="success"
                  type="datetime-local"
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
            <Box key={field.name}>
              {field.type === "string" && (
                <Box sx={{ width: 400 }}>
                  <FormControl fullWidth variant="outlined">
                    <TextField
                      label={field.name}
                      name={field.name}
                      value={createFieldWorkDTO.parameters[field.name] || ""}
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
                      name={field.name}
                      value={createFieldWorkDTO.parameters[field.name] || 0}
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
          workTypes={workTypes}
          onParcelSelect={handleParcelSelect}
          onRowClick={handleRowClick}
          previousWorks={previousWorks}
          onRowsSearch={handleRowsSearch}
        />

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save Field Work"}
          </Button>
        </Box>
      </form>
      {dialogOpen && (
        <AddNewWorkTypeDialog
          onConfirmAdd={handleDialogConfirm}
          onConfirmCancel={handleDialogClose}
          open={dialogOpen}
        />
      )}
    </Box>
  );
}

export default AddFieldWorkForm;
