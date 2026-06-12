import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItemButton,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { GetWorkTypeDTO } from "../../interfaces/response/GetWorkTypeDTO";

interface AffectedWorksDialogProps {
  onConfirmSelect: (numberOfDays: number, selectedWorkTypes: string[]) => void;
  onConfirmCancel: () => void;
  workTypes: GetWorkTypeDTO[];
  open: boolean;
}

function SelectAffectedRowsDialog({
  onConfirmSelect,
  onConfirmCancel,
  workTypes,
  open,
}: AffectedWorksDialogProps) {
  const [numberOfDays, setNumberOfDays] = useState("");
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    Array(workTypes.length).fill(false),
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumberOfDays(event.target.value);
  };

  const handleConfirm = () => {
    const days = Number(numberOfDays) || 0;
    onConfirmSelect(days >= 0 ? days : 0, selectedWorkTypes);
  };

  const handleCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;

    if (checked) {
      setSelectedWorkTypes(workTypes.map((workType) => workType.uid));
      setCheckedItems(Array(workTypes.length).fill(true));
    } else {
      setSelectedWorkTypes([]);
      setCheckedItems(Array(workTypes.length).fill(false));
    }
  };

  const handleIndividualCheck = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    name: string,
  ) => {
    const checked = event.target.checked;

    const updatedCheckedItems = [...checkedItems];
    updatedCheckedItems[index] = checked;
    setCheckedItems([...updatedCheckedItems]);

    if (checked) {
      const updatedSelectedWorkTypes = [...selectedWorkTypes, name];
      setSelectedWorkTypes(updatedSelectedWorkTypes);
    } else {
      const updatedSelectedWorkTypes = selectedWorkTypes.filter(
        (workType) => workType !== name,
      );
      setSelectedWorkTypes(updatedSelectedWorkTypes);
    }
  };

  return (
    <Box>
      <Dialog open={open} onClose={onConfirmCancel}>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Select previous affected rows
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Typography>Select affected rows from the previous</Typography>
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
            <Typography>{"day(s)."}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              Get affected rows only from these worktypes
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
                <Typography>{workType.name}</Typography>
                <Checkbox
                  checked={checkedItems[index]}
                  onChange={(e) =>
                    handleIndividualCheck(e, index, workType.uid)
                  }
                />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={onConfirmCancel} color="error">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="success">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SelectAffectedRowsDialog;
