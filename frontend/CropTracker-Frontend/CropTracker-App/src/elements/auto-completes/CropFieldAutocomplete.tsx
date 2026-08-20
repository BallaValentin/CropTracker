import { Autocomplete, TextField, Typography } from "@mui/material";
import type { GetCropFieldNameDTO } from "../../interfaces/response/GetCropFieldNameDTO";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const defaultOption = t(
    "elements.autocompletes.cropFieldAutocomplete.defaultValue",
    {
      defaultValue: "All Crop Fields",
    },
  );

  return (
    <Autocomplete
      options={cropFields || []}
      defaultValue={{
        name: defaultOption,
        uid: "",
      }}
      getOptionLabel={(option) =>
        !option.uid ? defaultOption : `${option.name}`
      }
      loading={isPending}
      onInputChange={(_event, newInputValue) => {
        onCropFieldSearch(newInputValue);
      }}
      onChange={(_event, newValue) => {
        onCropFieldSelect(newValue?.uid || "");
      }}
      renderInput={(params) => (
        <TextField
          color="success"
          {...params}
          label={
            <Typography fontWeight="bold">
              {t("elements.autocompletes.cropFieldAutocomplete.searchLabel", {
                defaultValue: "Search Crop Field",
              })}
            </Typography>
          }
        />
      )}
    />
  );
}

export default CropFieldAutocomplete;
