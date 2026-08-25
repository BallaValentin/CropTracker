import { Box, Button, Menu, MenuItem } from "@mui/material";
import type { GetCropFieldNameDTO } from "../../interfaces/response/GetCropFieldNameDTO";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

interface CropFieldMenuProps {
  onCropFieldSelect: (cropFieldId: string, checked: boolean) => void;
  cropFields: GetCropFieldNameDTO[];
}

function CropFieldMenu({ cropFields, onCropFieldSelect }: CropFieldMenuProps) {
  const { t } = useTranslation();

  const [cropFieldsAnchor, setCropFieldsAnchor] =
    useState<HTMLButtonElement | null>(null);

  const [checkedCropFields, setCheckedCropFields] = useState<boolean[]>([]);

  const cropFieldsMenuOpen = Boolean(cropFieldsAnchor);

  useEffect(() => {
    if (cropFields) {
      const updatedCropFields = Array(cropFields.length).fill(true);
      setCheckedCropFields([...updatedCropFields]);
    }
  }, [cropFields]);

  const updateChecked = (index: number) => {
    const updatedCropFields = [...checkedCropFields];
    updatedCropFields[index] = !updatedCropFields[index];
    setCheckedCropFields([...updatedCropFields]);
    onCropFieldSelect(cropFields[index].uid, updatedCropFields[index]);
  };

  return (
    <Box>
      <Button
        color="inherit"
        onClick={(e) => setCropFieldsAnchor(e.currentTarget)}
        sx={{ fontWeight: "bold" }}
      >
        {t("pages.workStatisticsPage.cropFieldFilter", {
          defaultValue: "Filter by Crop Field",
        })}
      </Button>
      <Menu
        anchorEl={cropFieldsAnchor}
        onClick={() => setCropFieldsAnchor(null)}
        open={cropFieldsMenuOpen}
      >
        {cropFields.map((cropField, index) => (
          <MenuItem
            selected={checkedCropFields[index]}
            onClick={() => updateChecked(index)}
          >
            {cropField.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default CropFieldMenu;
