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
import type { FieldDefinition } from "../../interfaces/FieldDefinition";
import type { StringNumber } from "../../interfaces/StringNumber";
import AddIcon from "@mui/icons-material/Add";
import type React from "react";

interface StringNumberListProps {
  entries: StringNumber[];
  field: FieldDefinition;
  onNewEntryAdded: (field: FieldDefinition) => void;
  onEntryTextChange: (
    field: FieldDefinition,
    index: number,
    newText: string,
  ) => void;
  onEntryNumberChange: (
    field: FieldDefinition,
    index: number,
    newNumber: number,
  ) => void;
}

function StringNumberList({
  entries,
  field,
  onNewEntryAdded,
  onEntryTextChange,
  onEntryNumberChange,
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
    onEntryTextChange(field, index, newText);
  };

  const handleNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const newNumber = Number(event.target.value) || 0;
    onEntryNumberChange(field, index, newNumber);
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
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );
}

export default StringNumberList;
