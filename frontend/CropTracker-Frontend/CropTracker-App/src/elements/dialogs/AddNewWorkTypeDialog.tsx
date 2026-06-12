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
import type { FieldDefinition } from "../../interfaces/FieldDefinition";

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
  const [createWorkTypeData, setCreateWorkTypeData] =
    useState<CreateWorkTypeDTO>({
      name: "",
      fieldDefinitions: [],
    });

  const handleConfirm = () => {
    onConfirmAdd(createWorkTypeData);
  };

  const handleWorkTypeNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCreateWorkTypeData((prev) => ({
      ...prev,
      name: event.target.value,
    }));
  };

  const handleAddFieldDefinition = () => {
    const hasEmptyDefinition = createWorkTypeData.fieldDefinitions.some(
      (fieldDefinition) =>
        fieldDefinition.name.trim() === "" &&
        fieldDefinition.type.trim() === "" &&
        fieldDefinition.required === false &&
        (fieldDefinition.options === undefined ||
          fieldDefinition.options.length === 0),
    );

    if (!hasEmptyDefinition) {
      const updatedDefinitions = [...createWorkTypeData.fieldDefinitions];
      updatedDefinitions.push({
        name: "",
        type: "string",
        required: false,
        options: [],
      });

      setCreateWorkTypeData((prev) => ({
        ...prev,
        fieldDefinitions: updatedDefinitions,
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

    setCreateWorkTypeData((prev) => ({
      ...prev,
      fieldDefinitions: updatedFieldDefinitions,
    }));
  };

  return (
    <Box>
      <Dialog open={open} onClose={onConfirmCancel} maxWidth="md">
        <DialogTitle sx={{ fontWeight: "bold" }}>Add New Work Type</DialogTitle>
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
                label="Work Type Name"
                color="success"
                placeholder="Add work type name"
                onChange={handleWorkTypeNameChange}
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
                    Field definitions
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
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      color="success"
                      label="Field Name"
                      variant="outlined"
                      value={fieldDefinition.name}
                      required
                      onChange={(e) =>
                        handleFieldChange(index, "name", e.target.value)
                      }
                      sx={{ flex: 1 }}
                    />

                    <FormControl sx={{ flex: 1 }}>
                      <InputLabel color="success" id={`type-label-${index}`}>
                        Field Type
                      </InputLabel>
                      <Select
                        color="success"
                        labelId={`type-label-${index}`}
                        label="Field Type"
                        value={fieldDefinition.type}
                        onChange={(e) =>
                          handleFieldChange(index, "type", e.target.value)
                        }
                      >
                        <MenuItem value="string">Text</MenuItem>
                        <MenuItem value="string[]">Multiple Text</MenuItem>
                        <MenuItem value="number">Number</MenuItem>
                        <MenuItem value="stringNumber[]">
                          Multiple Text and Number
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
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="success">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AddNewWorkTypeDialog;
