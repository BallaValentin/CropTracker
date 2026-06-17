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
import type { StringNumber } from "../../interfaces/helper/StringNumber";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import type React from "react";

interface StringNumberListProps {
  entries: StringNumber[];
  field: FieldDefinition;
  onNewEntryAdded: (field: FieldDefinition) => void;
  onEntryChange: (
    field: FieldDefinition,
    index: number,
    updatedEntry: StringNumber,
  ) => void;
  onEntryRemoved: (field: FieldDefinition, index: number) => void;
}

function StringNumberList({
  entries,
  field,
  onNewEntryAdded,
  onEntryChange,
  onEntryRemoved,
}: StringNumberListProps) {
  const handleAddNewStringNumber = (
    event: React.MouseEvent<HTMLButtonElement>,
    field: FieldDefinition,
  ) => {
    event.stopPropagation();
    onNewEntryAdded(field);
  };

  const handleTextChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const newText = event.target.value;
    onEntryChange(field, index, {
      textValue: newText,
      numberValue: entries[index].numberValue,
    });
  };

  const handleNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const newNumber = Number(event.target.value) || 0;
    onEntryChange(field, index, {
      textValue: entries[index].textValue,
      numberValue: newNumber,
    });
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
            <FormControl sx={{ flex: 1 }} variant="outlined">
              <TextField
                color="success"
                value={entry.textValue}
                type="text"
                onChange={(e) =>
                  handleTextChange(
                    e as React.ChangeEvent<HTMLInputElement>,
                    index,
                  )
                }
              />
            </FormControl>

            <FormControl sx={{ flex: 1 }} variant="outlined">
              <TextField
                color="success"
                value={entry.numberValue}
                type="number"
                onChange={(e) =>
                  handleNumberChange(
                    e as React.ChangeEvent<HTMLInputElement>,
                    index,
                  )
                }
              />
            </FormControl>
            <IconButton onClick={(e) => handleEntryRemove(e, field, index)}>
              <RemoveIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );
}

export default StringNumberList;
