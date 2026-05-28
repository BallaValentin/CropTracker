import {
  Box,
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
import type { GetCropFieldDTO } from "../../interfaces/response/GetCropFieldDTO";
import type { GetFieldParcelDTO } from "../../interfaces/response/GetFieldParcelDTO";
import SelectRowsView from "../../leaflet/SelectRowsView";
import { useEffect, useState } from "react";

interface AddFieldWorkFormProps {
  cropField: GetCropFieldDTO;
  fieldParcels: GetFieldParcelDTO[];
}

function AddFieldWorkForm({ cropField, fieldParcels }: AddFieldWorkFormProps) {
  const [affectedRows, setAffectedRows] = useState<boolean[]>([]);
  const [rowRanges, setRowRanges] = useState<[number, number][]>([]);

  useEffect(() => {
    let totalRows = 0;
    const newRowRanges: [number, number][] = [];
    fieldParcels.forEach((parcel) => {
      const minRange = totalRows;
      totalRows += parcel.layoutParameters.numberOfRows;
      const maxRange = totalRows;
      newRowRanges.push([minRange, maxRange]);
    });
    setRowRanges(newRowRanges);
    setAffectedRows(Array(totalRows).fill(false));
  }, [fieldParcels]);

  const handleParcelSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    event.stopPropagation();
    const checked = event.target.checked;

    const updatedRows = [...affectedRows];

    if (rowRanges[index]) {
      const [start, end] = rowRanges[index];
      console.log(start + "--->" + end);

      for (let i = start; i < end; i++) {
        updatedRows[i] = checked;
      }

      setAffectedRows(updatedRows);
    }
  };

  return (
    <Box>
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
          Select the affected rows
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
                  <ListSubheader
                    sx={{ fontWeight: "bold", lineHeight: "40px" }}
                  >
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
                      <Checkbox
                        onChange={(e) => handleParcelSelect(e, index)}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default AddFieldWorkForm;
