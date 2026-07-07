import { Autocomplete, TextField } from "@mui/material";
import type { GetWorkTypeNameDTO } from "../../interfaces/response/GetWorkTypeNameDTO";

interface WorkTypeAutocompleteProps {
  onWorkTypeSelect: (workTypeId: string) => void;
  onWorkTypeSearch: (searchTerm: string) => void;
  workTypes: GetWorkTypeNameDTO[];
  isPending: boolean;
}

function WorkTypeAutocomplete({
  onWorkTypeSelect,
  onWorkTypeSearch,
  workTypes,
  isPending,
}: WorkTypeAutocompleteProps) {
  return (
    <Autocomplete
      options={workTypes || []}
      defaultValue={{ name: "All Work Types", uid: "" }}
      getOptionLabel={(option) => `${option.name}`}
      loading={isPending}
      onInputChange={(_event, newInputValue) => {
        onWorkTypeSearch(newInputValue);
      }}
      onChange={(_event, newValue) => {
        onWorkTypeSelect(newValue?.uid || "");
      }}
      renderInput={(params) => (
        <TextField color="success" {...params} label="Search Work Type" />
      )}
    />
  );
}

export default WorkTypeAutocomplete;
