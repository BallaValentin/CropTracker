import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { type CreateWorkTypeDTO } from "../../interfaces/request/CreateWorkTypeDTO";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import type { FieldDefinition } from "../../interfaces/helper/FieldDefinition";
import { standardNameRegex } from "../../utils/Constants";
import { getNameError } from "../../utils/FormSubmitHelper";
import { useTranslation } from "react-i18next";

interface AddNewWorkTypeDialogProps {
  onConfirmAdd: (createWorkTypeDTO: CreateWorkTypeDTO) => void;
  onConfirmCancel: () => void;
  open: boolean;
}

function AddNewWorkTypeDialog({
  onConfirmAdd,
  onConfirmCancel,
  open,
}: AddNewWorkTypeDialogProps) {
  const { t } = useTranslation();

  const [createWorkTypeData, setCreateWorkTypeData] =
    useState<CreateWorkTypeDTO>({
      name: "",
      fieldDefinitions: [],
    });

  const [createWorkTypeError, setCreateWorkTypeError] = useState<
    Record<string, string | string[]>
  >({
    nameError: "",
    fieldDefinitionErrors: [] as string[],
  });

  const handleConfirm = () => {
    const nameError = getNameError(createWorkTypeData.name || "") ?? "";

    setCreateWorkTypeError((prev) => ({
      ...prev,
      nameError: nameError,
    }));

    const updatedFieldDefinitionErrors =
      createWorkTypeData.fieldDefinitions.map((fieldDefinition) => {
        const currentName = fieldDefinition.name || "";
        if (!standardNameRegex.test(currentName)) {
          return getNameError(currentName) ?? "";
        }
        return "";
      });

    const hasFieldErrors = updatedFieldDefinitionErrors.some(
      (error) => error !== "",
    );

    setCreateWorkTypeError((prev) => ({
      ...prev,
      fieldDefinitionErrors: updatedFieldDefinitionErrors,
    }));

    if (!!nameError || hasFieldErrors) return;

    onConfirmAdd(createWorkTypeData);
  };

  const handleWorkTypeNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newName = event.target.value;
    setCreateWorkTypeData((prev) => ({
      ...prev,
      name: newName,
    }));
  };

  const handleAddFieldDefinition = () => {
    const hasEmptyDefinition = createWorkTypeData.fieldDefinitions.some(
      (fieldDefinition) => fieldDefinition.name.trim() === "",
    );

    if (
      !hasEmptyDefinition ==
      createWorkTypeData.fieldDefinitions.length < 10
    ) {
      const updatedDefinitions = [...createWorkTypeData.fieldDefinitions];
      updatedDefinitions.push({
        name: "",
        type: "string",
        required: false,
        options: [],
      });

      const updatedFieldDefinitionErrors = [
        ...(createWorkTypeError.fieldDefinitionErrors as string[]),
        "",
      ];

      setCreateWorkTypeData((prev) => ({
        ...prev,
        fieldDefinitions: updatedDefinitions,
      }));

      setCreateWorkTypeError((prev) => ({
        ...prev,
        fieldDefinitionErrors: updatedFieldDefinitionErrors,
      }));
    }
  };

  const handleFieldChange = (
    index: number,
    key: keyof FieldDefinition,
    value: string,
  ) => {
    const updatedFieldDefinitions = [...createWorkTypeData.fieldDefinitions];
    updatedFieldDefinitions[index] = {
      ...updatedFieldDefinitions[index],
      [key]: value,
    };

    setCreateWorkTypeData((prev) => ({
      ...prev,
      fieldDefinitions: updatedFieldDefinitions,
    }));
  };

  const handleDefinitionDelete = (index: number) => {
    const updatedFieldDefinitions = [
      ...createWorkTypeData.fieldDefinitions,
    ].filter((_fieldDefiniton, defIndex) => defIndex !== index);

    const updatedFieldDefinitionErrors = [
      ...createWorkTypeError.fieldDefinitionErrors,
    ].filter((_fieldDefinitionError, defIndex) => defIndex !== index);

    setCreateWorkTypeData((prev) => ({
      ...prev,
      fieldDefinitions: updatedFieldDefinitions,
    }));

    setCreateWorkTypeError((prev) => ({
      ...prev,
      fieldDefinitionErrors: updatedFieldDefinitionErrors,
    }));
  };

  return (
    <Box>
      <Dialog open={open} onClose={onConfirmCancel} maxWidth="md">
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {t("elements.dialogs.addNewWorkTypeDialog.dialogTitle") ||
            "Add New Work Type"}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: 600,
              gap: 2.5,
            }}
          >
            <Box sx={{ width: 250 }}>
              <TextField
                fullWidth
                type="text"
                name="name"
                label={
                  t(
                    "elements.dialogs.addNewWorkTypeDialog.workTypeNameTextField",
                  ) || "Work Type Name"
                }
                color="success"
                value={createWorkTypeData.name}
                placeholder={
                  t(
                    "elements.dialogs.addNewWorkTypeDialog.workTypeNamePlaceholder",
                  ) || "Add new work type name"
                }
                onChange={handleWorkTypeNameChange}
                error={!!createWorkTypeError.nameError}
                helperText={createWorkTypeError.nameError}
                required
              />
            </Box>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontWeight: "bold" }}>
                    {t(
                      "elements.dialogs.addNewWorkTypeDialog.fieldDefinitions",
                    ) || "Field Definitions"}
                  </Typography>
                  <IconButton onClick={handleAddFieldDefinition}>
                    <AddIcon />
                  </IconButton>
                </Box>
                <Divider />
              </Box>

              {createWorkTypeData.fieldDefinitions.map(
                (fieldDefinition, index) => (
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      gap: 1.5,
                      alignItems: "flex-start",
                    }}
                  >
                    <TextField
                      color="success"
                      label={
                        t(
                          "elements.dialogs.addNewWorkTypeDialog.fieldNameTextField",
                        ) || "Field Name"
                      }
                      variant="outlined"
                      value={fieldDefinition.name}
                      required
                      error={
                        !!createWorkTypeError.fieldDefinitionErrors?.[index]
                      }
                      helperText={
                        createWorkTypeError.fieldDefinitionErrors?.[index] ||
                        " "
                      }
                      onChange={(e) =>
                        handleFieldChange(index, "name", e.target.value)
                      }
                      sx={{ flex: 1 }}
                    />

                    <FormControl sx={{ flex: 1 }}>
                      <InputLabel color="success" id={`type-label-${index}`}>
                        {t(
                          "elements.dialogs.addNewWorkTypeDialog.fieldTypeLabel",
                        ) || "Field Type"}
                      </InputLabel>
                      <Select
                        color="success"
                        labelId={`type-label-${index}`}
                        label={
                          t(
                            "elements.dialogs.addNewWorkTypeDialog.fieldTypeLabel",
                          ) || "Field Type"
                        }
                        value={fieldDefinition.type}
                        onChange={(e) =>
                          handleFieldChange(index, "type", e.target.value)
                        }
                      >
                        <MenuItem value="string">
                          {t(
                            "elements.dialogs.addNewWorkTypeDialog.stringMenuItem",
                          ) || "Text"}
                        </MenuItem>
                        <MenuItem value="string[]">
                          {t(
                            "elements.dialogs.addNewWorkTypeDialog.stringArrayMenuItem",
                          ) || "Multiple Text"}
                        </MenuItem>
                        <MenuItem value="number">
                          {t(
                            "elements.dialogs.addNewWorkTypeDialog.numberMenuItem",
                          ) || "Number"}
                        </MenuItem>
                        <MenuItem value="stringNumber[]">
                          {t(
                            "elements.dialogs.addNewWorkTypeDialog.stringNumberMenuItem",
                          ) || "Multiple Text & Number"}
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <IconButton onClick={() => handleDefinitionDelete(index)}>
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                ),
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onConfirmCancel} color="error">
            {t("elements.dialogs.addNewWorkTypeDialog.cancelButton") ||
              "Cancel"}
          </Button>
          <Button onClick={handleConfirm} color="success">
            {t("elements.dialogs.addNewWorkTypeDialog.saveButton") || "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AddNewWorkTypeDialog;
