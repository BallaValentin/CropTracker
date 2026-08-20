import { Autocomplete, TextField, Typography } from "@mui/material";
import type { GetWorkTypeNameDTO } from "../../interfaces/response/GetWorkTypeNameDTO";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const defaultOption = t(
    "elements.autocompletes.workTypeAutocomplete.defaultValue",
    {
      defaultValue: "All Crop Fields",
    },
  );

  return (
    <Autocomplete
      options={workTypes || []}
      defaultValue={{ name: defaultOption, uid: "" }}
      getOptionLabel={(option) =>
        !option.uid
          ? defaultOption
          : t(
              `elements.forms.addFieldWorkForm.systemWorkTypes.${option.name}.name`,
              {
                defaultValue: option.name,
              },
            )
      }
      loading={isPending}
      onInputChange={(_event, newInputValue) => {
        onWorkTypeSearch(newInputValue);
      }}
      onChange={(_event, newValue) => {
        onWorkTypeSelect(newValue?.uid || "");
      }}
      renderInput={(params) => (
        <TextField
          color="success"
          {...params}
          label={
            <Typography fontWeight="bold">
              {t("elements.autocompletes.workTypeAutocomplete.searchLabel", {
                defaultValue: "Search Work Type",
              })}
            </Typography>
          }
        />
      )}
    />
  );
}

export default WorkTypeAutocomplete;
