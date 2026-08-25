import { Box, Button, Menu, MenuItem } from "@mui/material";
import type { GetWorkTypeNameDTO } from "../../interfaces/response/GetWorkTypeNameDTO";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

interface WorkTypeMenuProps {
  onWorkTypeSelect: (workTypeId: string, checked: boolean) => void;
  workTypes: GetWorkTypeNameDTO[];
}

function WorkTypeMenu({ workTypes, onWorkTypeSelect }: WorkTypeMenuProps) {
  const { t } = useTranslation();

  const [workTypesAnchor, setWorkTypesAnchor] =
    useState<HTMLButtonElement | null>(null);

  const [checkedWorkTypes, setCheckedWorkTypes] = useState<boolean[]>([]);

  const workTypesMenuOpen = Boolean(workTypesAnchor);

  useEffect(() => {
    if (workTypes) {
      const updatedWorkTypes = Array(workTypes.length).fill(true);
      setCheckedWorkTypes([...updatedWorkTypes]);
    }
  }, [workTypes]);

  const updateChecked = (index: number) => {
    const updatedWorkTypes = [...checkedWorkTypes];
    updatedWorkTypes[index] = !updatedWorkTypes[index];
    setCheckedWorkTypes([...updatedWorkTypes]);
    onWorkTypeSelect(workTypes[index].uid, updatedWorkTypes[index]);
  };

  return (
    <Box>
      <Button
        color="inherit"
        onClick={(e) => setWorkTypesAnchor(e.currentTarget)}
        sx={{ fontWeight: "bold" }}
      >
        {t("pages.workStatisticsPage.workTypeFilter", {
          defaultValue: "Filter by Work Type",
        })}
      </Button>
      <Menu
        anchorEl={workTypesAnchor}
        onClick={() => setWorkTypesAnchor(null)}
        open={workTypesMenuOpen}
      >
        {workTypes.map((workType, index) => (
          <MenuItem
            selected={checkedWorkTypes[index]}
            onClick={() => updateChecked(index)}
          >
            {t(
              `elements.forms.addFieldWorkForm.systemWorkTypes.${workType.name}.name`,
              {
                defaultValue: workType.name,
              },
            )}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default WorkTypeMenu;
