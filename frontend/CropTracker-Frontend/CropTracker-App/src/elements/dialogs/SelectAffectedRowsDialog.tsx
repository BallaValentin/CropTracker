import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface AffectedWorksDialogProps {
  onConfirmSelect: (numberOfDays: number) => void;
  onConfirmCancel: () => void;
  open: boolean;
}

function SelectAffectedRowsDialog({
  onConfirmSelect,
  onConfirmCancel,
  open,
}: AffectedWorksDialogProps) {
  const [numberOfDays, setNumberOfDays] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumberOfDays(event.target.value);
  };

  const handleConfirm = () => {
    const days = Number(numberOfDays) || 0;
    onConfirmSelect(days >= 0 ? days : 0);
  };

  return (
    <Box>
      <Dialog open={open} onClose={onConfirmCancel}>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Select previous affected rows
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
