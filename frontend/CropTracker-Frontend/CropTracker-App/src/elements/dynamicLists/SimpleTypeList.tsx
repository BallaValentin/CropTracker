import {
  Box,
  Divider,
  FormControl,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import type { FieldDefinition } from "../../interfaces/helper/FieldDefinition";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import type React from "react";

interface SimpleTypeListProps {
  entries: string[] | number[];
  field: FieldDefinition;
  onNewEntryAdded: (field: FieldDefinition) => void;
  onEntryChange: (
    field: FieldDefinition,
    index: number,
    newValue: string | number,
  ) => void;
  onEntryRemoved: (field: FieldDefinition, index: number) => void;
}

function SimpleTypeList({
  entries,
  field,
  onNewEntryAdded,
  onEntryChange,
  onEntryRemoved,
}: SimpleTypeListProps) {
  const handleAddNewStringNumber = (
    event: React.MouseEvent<HTMLButtonElement>,
    field: FieldDefinition,
  ) => {
    event.stopPropagation();
    onNewEntryAdded(field);
  };

  const handleEntryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const newText = event.target.value;
    onEntryChange(field, index, newText);
  };

  const handleEntryRemove = (
    event: React.MouseEvent<HTMLButtonElement>,
    field: FieldDefinition,
    index: number,
  ) => {
    event.stopPropagation();

    onEntryRemoved(field, index);
  };

  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography>{field.name}</Typography>
        <IconButton onClick={(e) => handleAddNewStringNumber(e, field)}>
          <AddIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {entries.map((entry, index) => (
          <ListItem
            disableGutters
            key={index}
            sx={{
              width: "100%",
              display: "flex",
              gap: 2,
            }}
          >
            <FormControl sx={{ flex: 1 }} fullWidth variant="outlined">
              <TextField
                color="success"
                value={entry}
                type="text"
                onChange={(e) =>
                  handleEntryChange(
                    e as React.ChangeEvent<HTMLInputElement>,
                    index,
                  )
                }
              />
            </FormControl>

            <IconButton
              size="small"
              onClick={(e) => handleEntryRemove(e, field, index)}
            >
              <RemoveIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );
}

export default SimpleTypeList;
