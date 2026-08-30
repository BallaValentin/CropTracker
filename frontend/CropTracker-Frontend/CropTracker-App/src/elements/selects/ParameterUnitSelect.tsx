import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { type Option } from "../../interfaces/helper/FieldDefinition";

interface ParameterUnitSelectProps {
  fieldName: string;
  workTypeName: string;
  options: Option[];
  onOptionSelected: (newOption: number) => void;
}

function ParameterUnitSelect({
  fieldName,
  options,
  onOptionSelected,
}: ParameterUnitSelectProps) {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<string>("0");

  return (
    <FormControl sx={{ width: 400 }} color="success">
      <InputLabel id={`${fieldName}-select-label`}>
        {t("elements.selects.parameterUnitSelect.labelText", {
          defaultValue: "Options",
        })}
      </InputLabel>
      <Select
        labelId={`${fieldName}-select-label`}
        id={`${fieldName}-select`}
        label={t("elements.selects.parameterUnitSelect.labelText", {
          defaultValue: "Options",
        })}
        color="success"
        value={selectedOption}
        onChange={(e) => {
          setSelectedOption(e.target.value);
          onOptionSelected(Number(e.target.value) || 0);
        }}
        sx={{ width: 400 }}
      >
        {options.map((option, optionIndex) => (
          <MenuItem key={`option-${optionIndex + 1}`} value={optionIndex}>
            {option.optionName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default ParameterUnitSelect;
