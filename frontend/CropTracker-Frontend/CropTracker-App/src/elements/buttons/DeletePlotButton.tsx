import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

interface DeletePlotButtonProps {
  onDeleteButtonClicked: () => void;
}

function DeletePlotButton({ onDeleteButtonClicked }: DeletePlotButtonProps) {
  return (
    <IconButton onClick={onDeleteButtonClicked}>
      <DeleteIcon color="error" />
    </IconButton>
  );
}

export default DeletePlotButton;
