import {
  Box,
  Button,
  Checkbox,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Paper,
  Typography,
} from "@mui/material";
import SelectRowsView from "../../leaflet/SelectRowsView";
import type { GetCropFieldDTO } from "../../interfaces/response/GetCropFieldDTO";
import type { GetFieldParcelDTO } from "../../interfaces/response/GetFieldParcelDTO";
import { useState } from "react";
import SelectAffectedRowsDialog from "../dialogs/SelectAffectedRowsDialog";

interface SelectFieldRowsPanelProps {
  cropField: GetCropFieldDTO;
  fieldParcels: GetFieldParcelDTO[];
  affectedRows: boolean[];
  previousRows: boolean[];
  onParcelSelect: (index: number, checked: boolean) => void;
  onRowsSearch: (rows: number) => void;
  onRowClick: (index: number) => void;
}

function SelectFieldRowsPanel({
  cropField,
  fieldParcels,
  affectedRows,
  onParcelSelect,
  previousRows,
  onRowsSearch,
  onRowClick,
}: SelectFieldRowsPanelProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleParcelSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    event.stopPropagation();
    const checked = event.target.checked;
    onParcelSelect(index, checked);
  };

  const handleShowPrevWorks = () => {
    setDialogOpen(true);
  };

  const handleSelect = (days: number) => {
    console.log("Number of days: ", days);
    onRowsSearch(days);
    console.log(previousRows);
    setDialogOpen(false);
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 2,
        mt: 2,
        height: 800,
        width: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <Typography
        variant="h6"
        sx={{ p: 2, fontWeight: "bold", letterSpacing: "0.05rem" }}
      >
        Select field parcels for work
      </Typography>
      <Box sx={{ display: "flex", height: "100%" }}>
        <Box sx={{ flex: 1, p: 2 }}>
          <SelectRowsView
            polygonPoints={cropField.polygonPoints}
            markerPosition={cropField.markerPosition}
            uid={""}
            mapHeight={700}
            fieldParcels={fieldParcels}
            affectedRows={affectedRows}
            onRowClick={onRowClick}
            previousRows={previousRows}
          />
        </Box>
        <Box sx={{ flex: 1, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              margin: "auto",
              flexDirection: "column",
              maxWidth: 320,
              gap: 1,
            }}
          >
            <List
              subheader={
                <ListSubheader sx={{ fontWeight: "bold", lineHeight: "40px" }}>
                  Select the parcels to work on
                </ListSubheader>
              }
            >
              <Divider />
              {fieldParcels.map((parcel, index) => (
                <ListItem key={parcel.uid}>
                  <ListItemButton
                    sx={{
                      minWidth: 320,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <ListItemText primary={`Parcel ${index + 1}`} />
                    <Checkbox onChange={(e) => handleParcelSelect(e, index)} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handleShowPrevWorks} color="success">
                Show affected rows from previous works
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      {dialogOpen && (
        <SelectAffectedRowsDialog
          onConfirmSelect={handleSelect}
          onConfirmCancel={handleCancel}
          open={dialogOpen}
        />
      )}
    </Paper>
  );
}

export default SelectFieldRowsPanel;
