import { Autocomplete, TextField } from "@mui/material";
import type { GetCropFieldNameDTO } from "../../interfaces/response/GetCropFieldNameDTO";

interface CropFieldAutocompleteProps {
  onCropFieldSelect: (cropFieldId: string) => void;
  onCropFieldSearch: (searchTerm: string) => void;
  cropFields: GetCropFieldNameDTO[];
  isPending: boolean;
}

function CropFieldAutocomplete({
  onCropFieldSelect,
  onCropFieldSearch,
  cropFields,
  isPending,
}: CropFieldAutocompleteProps) {
  return (
    <Autocomplete
      options={cropFields || []}
      defaultValue={{ name: "All Crop Fields", uid: "" }}
      getOptionLabel={(option) => `${option.name}`}
      loading={isPending}
      onInputChange={(_event, newInputValue) => {
        onCropFieldSearch(newInputValue);
      }}
      onChange={(_event, newValue) => {
        onCropFieldSelect(newValue?.uid || "");
      }}
      renderInput={(params) => (
        <TextField color="success" {...params} label="Search Crop Field" />
      )}
    />
  );
}

export default CropFieldAutocomplete;
