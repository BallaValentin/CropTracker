import {
  Box,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import type { GetFieldParcelDTO } from "../../interfaces/response/GetFieldParcelDTO";

interface FieldParcelItemProps {
  parcel: GetFieldParcelDTO;
  selected: boolean;
  index: number;
  onParcelExpand: (index: number) => void;
  onParcelUpdate: (parcel: GetFieldParcelDTO) => void;
  onParcelDelete: (index: string) => void;
}

function FieldParcelItem({
  parcel,
  selected,
  index,
  onParcelExpand,
  onParcelUpdate,
  onParcelDelete,
}: FieldParcelItemProps) {
  const handleParcelSelect = (
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  ) => {
    event.stopPropagation();
    onParcelExpand(index);
  };

  const handleParcelUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onParcelUpdate(parcel);
  };

  const handleParcelDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onParcelDelete(parcel.uid);
  };

  return (
    <ListItem
      key={index}
      component={"div"}
      onClick={handleParcelSelect}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",

        "&:hover": {
          "& .MuiListItemButton-root, & .MuiCollapse-root": {
            backgroundColor: "action.hover",
          },
        },
      }}
    >
      <ListItemButton
        disableGutters
        disableRipple
        sx={{
          px: 0.5,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          backgroundColor: selected ? "action.selected" : "transparent",
          transition: "background-color 0.2s ease",
        }}
      >
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <IconButton onClick={handleParcelSelect}>
            {selected ? <KeyboardArrowDownIcon /> : <ChevronRightIcon />}
          </IconButton>
          <ListItemText primary={`Parcel ${index + 1}`} />
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={handleParcelUpdate}>
            <UpdateIcon />
          </IconButton>
          <IconButton onClick={handleParcelDelete}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </ListItemButton>
      <Collapse
        sx={{
          width: "100%",

          backgroundColor: selected ? "action.selected" : "transparent",
          transition: "background-color 0.2s ease, height 0.3s ease-in-out",
        }}
        in={selected}
        timeout={"auto"}
        unmountOnExit
      >
        <List component="div" disablePadding sx={{ pl: 5, pr: 2, pb: 1 }}>
          <ListItem
            disableGutters
            sx={{ py: 0.25, display: "flex", justifyContent: "space-between" }}
          >
            <Typography variant="body2" color="text.secondary">
              Layout Type:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {parcel.layoutType || "Honeycrisp"}
            </Typography>
          </ListItem>

          <ListItem
            disableGutters
            sx={{ py: 0.25, display: "flex", justifyContent: "space-between" }}
          >
            <Typography variant="body2" color="text.secondary">
              Rows Count:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {parcel.layoutParameters.numberOfRows || 24}
            </Typography>
          </ListItem>

          <ListItem
            disableGutters
            sx={{ py: 0.25, display: "flex", justifyContent: "space-between" }}
          >
            <Typography variant="body2" color="text.secondary">
              Area:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {`${(parcel.area / 10000).toFixed(2)} ha`}
            </Typography>
          </ListItem>
        </List>
      </Collapse>
      <Divider sx={{ width: "100%" }} />
    </ListItem>
  );
}

export default FieldParcelItem;
