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
  Typography,
} from "@mui/material";
import type { GetPreviousWorkDTO } from "../../interfaces/response/GetPreviousWorkDTO";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";

interface SelectWorksDialogProps {
  onBack: () => void;
  onConfirmCancel: () => void;
  fieldWorks: GetPreviousWorkDTO[];
  open: boolean;
  checkedFieldWorks: boolean[];
  onCheckFieldWork: (checkedWorkTypes: boolean[]) => void;
}

function SelectWorksDialog({
  onBack,
  onConfirmCancel,
  fieldWorks,
  open,
  checkedFieldWorks,
  onCheckFieldWork,
}: SelectWorksDialogProps) {
  const [checkedNumber, setCheckedNumber] = useState<number>(0);

  useEffect(() => {
    if (checkedFieldWorks) {
      const newCheckedNumber = checkedFieldWorks.filter(
        (checkedWork) => checkedWork === true,
      ).length;
      setCheckedNumber(newCheckedNumber);
    }
  }, [checkedFieldWorks]);

  const handleCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;

    let updatedCheckedItems = Array(checkedFieldWorks.length).fill(true);
    setCheckedNumber(updatedCheckedItems.length);

    if (!checked) {
      updatedCheckedItems = Array(checkedFieldWorks.length).fill(false);
      setCheckedNumber(0);
    }

    onCheckFieldWork([...updatedCheckedItems]);
  };

  const handleIndividualCheck = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const checked = event.target.checked;

    const updatedCheckedItems = [...checkedFieldWorks];
    updatedCheckedItems[index] = checked;

    onCheckFieldWork([...updatedCheckedItems]);
  };

  return (
    <Box>
      <Dialog open={open} onClose={onConfirmCancel} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
            position: "relative",
          }}
        >
          <IconButton onClick={() => onBack()}>
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: "600" }}>
            Select previous works
          </Typography>
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={onConfirmCancel}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography fontSize={"medium"} variant="caption">
                  Found:
                </Typography>
                <Typography sx={{ fontWeight: "bold" }}>
                  {fieldWorks.length}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography fontSize={"medium"} variant="caption">
                  Selected:
                </Typography>
                <Typography sx={{ fontWeight: "bold" }}>
                  {checkedNumber}
                </Typography>
              </Box>
            </Box>
            <Checkbox sx={{ p: 0 }} onChange={(e) => handleCheckAll(e)} />
          </Box>

          <Divider sx={{ borderWidth: 2 }} />

          <List>
            {fieldWorks.map((fieldWork, index) => (
              <ListItemButton
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      fontSize={"small"}
                      sx={{ fontStyle: "italic", fontWeight: "bold" }}
                    >
                      {`${fieldWork.startDate.substring(0, 10)} ${fieldWork.startDate.substring(11, 16)}`}
                    </Typography>

                    {fieldWork.endDate && (
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        fontSize={"small"}
                        sx={{ fontStyle: "italic", fontWeight: "bold" }}
                      >
                        {`-${fieldWork.endDate.substring(0, 10)} ${fieldWork.endDate.substring(11, 16)}`}
                      </Typography>
                    )}
                  </Box>
                  <Typography>{fieldWork.workTypeName}</Typography>
                </Box>
                <Checkbox
                  checked={checkedFieldWorks[index] ?? false}
                  onChange={(e) => handleIndividualCheck(e, index)}
                />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={onConfirmCancel} color="success">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SelectWorksDialog;
