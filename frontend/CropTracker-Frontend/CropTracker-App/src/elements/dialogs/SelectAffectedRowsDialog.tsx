import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItemButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import type { GetWorkTypeDTO } from "../../interfaces/response/GetWorkTypeDTO";
import { useTranslation } from "react-i18next";

interface AffectedWorksDialogProps {
  isPending: boolean;
  onConfirmSelect: (numberOfDays: number) => void;
  onConfirmCancel: () => void;
  workTypes: GetWorkTypeDTO[];
  open: boolean;
  checkedWorkTypes: boolean[];
  onSelectWorkType: (checkedWorkTypes: boolean[], workTypeName: string) => void;
}

function SelectAffectedRowsDialog({
  isPending,
  onConfirmSelect,
  onConfirmCancel,
  workTypes,
  open,
  checkedWorkTypes,
  onSelectWorkType,
}: AffectedWorksDialogProps) {
  const { t } = useTranslation();
  const [numberOfDays, setNumberOfDays] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumberOfDays(event.target.value);
  };

  const handleConfirm = () => {
    const days = Number(numberOfDays) || 0;
    onConfirmSelect(days >= 0 ? days : 0);
  };

  const handleCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;

    if (checked) {
      onSelectWorkType(Array(workTypes.length).fill(true), "");
    } else {
      onSelectWorkType(Array(workTypes.length).fill(false), "");
    }
  };

  const handleIndividualCheck = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    name: string,
  ) => {
    const checked = event.target.checked;

    const updatedCheckedItems = [...checkedWorkTypes];
    updatedCheckedItems[index] = checked;
    onSelectWorkType([...updatedCheckedItems], name);
  };

  return (
    <Box>
      <Dialog open={open} onClose={onConfirmCancel}>
        <DialogTitle
          sx={{ display: "flex", fontWeight: "bold", position: "relative" }}
        >
          {t("elements.dialogs.selectAffectedRowsDialog.dialogTitle") ||
            "Select previous affected rows"}
          <IconButton
            disabled={isPending}
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={() => onConfirmCancel()}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Typography>
              {t("elements.dialogs.selectAffectedRowsDialog.dialogContent1") ||
                "Select affected rows from the previous"}
            </Typography>
            <TextField
              color="success"
              type="number"
              size="small"
              sx={{
                width: 80,
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
              }}
              onChange={handleChange}
            />
            <Typography>
              {" "}
              {t("elements.dialogs.selectAffectedRowsDialog.dialogContent2") ||
                "day(s)"}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              {t("elements.dialogs.selectAffectedRowsDialog.workTypesSelect") ||
                "Get affected rows from these work types"}
            </Typography>
            <Checkbox onChange={(e) => handleCheckAll(e)} />
          </Box>
          <Divider />
          <List>
            {workTypes.map((workType, index) => (
              <ListItemButton
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography>
                  {t(
                    `elements.forms.addFieldWorkForm.systemWorkTypes.${workType.name}.name`,
                    {
                      defaultValue: workType.name,
                      returnObjects: false,
                    },
                  ) || workType.name}
                </Typography>
                <Checkbox
                  checked={checkedWorkTypes[index]}
                  onChange={(e) =>
                    handleIndividualCheck(e, index, workType.uid)
                  }
                />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button disabled={isPending} onClick={onConfirmCancel} color="error">
            {t("elements.dialogs.selectAffectedRowsDialog.cancelButton") ||
              "Cancel"}
          </Button>
          <Button disabled={isPending} onClick={handleConfirm} color="success">
            {t("elements.dialogs.selectAffectedRowsDialog.applyButton") ||
              "Apply"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SelectAffectedRowsDialog;
