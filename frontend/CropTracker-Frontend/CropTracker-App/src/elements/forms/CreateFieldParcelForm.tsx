import { Autocomplete, Box, Paper, TextField } from "@mui/material";
import type { GetCropFieldDTO } from "../../interfaces/response/GetCropFieldDTO";
import { useCropSearch } from "../../hooks/UseCropSearch";
import { useState } from "react";
import type { CreateFieldParcelDTO } from "../../interfaces/response/CreateFieldParcelDTO";

interface CreateFieldParcelFormProps {
  onSubmit: (createFieldParcelData: CreateFieldParcelDTO) => void;
  cropfield: GetCropFieldDTO;
}

function CreateFieldParcelForm({
  onSubmit,
  //cropfield,
}: CreateFieldParcelFormProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newFieldParcel, setNewFieldParcel] = useState<CreateFieldParcelDTO>({
    cropName: "",
    polygonPoints: [],
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
        <form onSubmit={handleSubmit}>
          <Autocomplete
            color="success"
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
              <TextField {...params} label="Search Crop Type" />
            )}
          />
        </form>
      </Paper>
    </Box>
  );
}

export default CreateFieldParcelForm;
