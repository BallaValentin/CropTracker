import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Paper,
  Typography,
} from "@mui/material";
import ColumnCenterContainer from "../containers/ColumnCenterContainer";
import type { GetCropFieldDTO } from "../../interfaces/response/GetCropFieldDTO";
import AddIcon from "@mui/icons-material/Add";
import type { GetFieldParcelDTO } from "../../interfaces/response/GetFieldParcelDTO";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
import { useEffect, useState } from "react";
import DeleteFieldParcelDialog from "../dialogs/DeleteFieldParcelDialog";
import FieldDetailMapPreview from "../../leaflet/FieldDetailMapPreview";
import type { LatLngObject } from "../../interfaces/helper/LatLngObject";
import {
  getGeneratedCrops,
  getGeneratedRectabgles,
  getGeneratedRows,
} from "../../utils/GenerateShapesUtil";

interface CropFieldInfoPanelProps {
  isLoading: boolean;
  cropFieldDetail: GetCropFieldDTO;
  fieldParcels: GetFieldParcelDTO[];
  onAddParcelClick: () => void;
  onUpdateParcelClick: (fieldParcel: GetFieldParcelDTO) => void;
  onConfirmDelete: (fieldParcelId: string) => void;
}

function CropFieldInfoPanel({
  isLoading,
  fieldParcels,
  cropFieldDetail,
  onAddParcelClick,
  onUpdateParcelClick,
  onConfirmDelete,
}: CropFieldInfoPanelProps) {
  const [rows, setRows] = useState<LatLngObject[][][]>([]);
  const [rowRectangles, setRowRectangles] = useState<LatLngObject[][]>([]);
  const [cropCoords, setCropCoords] = useState<LatLngObject[]>([]);

  useEffect(() => {
    const currentRows =
      fieldParcels.map((parcel) => {
        return getGeneratedRows({
          polygonCoords: parcel.polygonPoints,
          referenceRow: parcel.layoutParameters.referenceRow,
          numberOfRows: parcel.layoutParameters.numberOfRows,
          rowDistance:
            parcel.layoutParameters.bedSpacing +
            parcel.layoutParameters.rowWidth,
        });
      }) || [];
    setRows(currentRows);
  }, [fieldParcels]);

  useEffect(() => {
    const currentCropRectangles = fieldParcels.flatMap((parcel, index) => {
      return getGeneratedRectabgles({
        rows: rows[index] || [],
        rowWidth: parcel.layoutParameters.rowWidth,
      });
    });
    setRowRectangles(currentCropRectangles);
  }, [fieldParcels, rows]);

  useEffect(() => {
    const currentCropCoords = fieldParcels.flatMap((parcel, index) => {
      return getGeneratedCrops({
        rows: rows[index] || [],
        rowWidth: parcel.layoutParameters.rowWidth,
        rowMargin: parcel.layoutParameters.marginSpacing,
        rowSpacing: parcel.layoutParameters.rowSpacing,
        cropSpacing: parcel.layoutParameters.plantSpacing,
      });
    });
    setCropCoords(currentCropCoords);
  }, [fieldParcels, rows]);

  const AddParcelButton = () => {
    return (
      <Button
        startIcon={<AddIcon />}
        onClick={onAddParcelClick}
        size="medium"
        color="success"
      >
        Add new field parcel
      </Button>
    );
  };

  const [deleteParcelOpen, setDeleteParcelOpen] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState("");

  const handleParcelDeleteClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    fieldParcelId: string,
  ) => {
    event.stopPropagation();
    setDeleteParcelOpen(true);
    setSelectedParcel(fieldParcelId);
  };

  const handleParcelDelete = () => {
    onConfirmDelete(selectedParcel);
    setDeleteParcelOpen(false);
    setSelectedParcel("");
  };

  const handleParcelDeleteCancel = () => {
    setDeleteParcelOpen(false);
    setSelectedParcel("");
  };

  const handleParcelUpdateClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    fieldParcel: GetFieldParcelDTO,
  ) => {
    event.stopPropagation();
    onUpdateParcelClick(fieldParcel);
  };

  return (
    <Box>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ flex: 1, p: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 4, fontStyle: "italic" }}
          >
            Here you can view the details of your field. The map below shows the
            location and boundaries of your field.
          </Typography>

          <Paper
            elevation={0}
            sx={{
              position: "relative",
              overflow: "hidden",
              mt: 2,
              mb: 2,
              height: 600,
              width: "100%",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <FieldDetailMapPreview
              mapHeight={600}
              uid={cropFieldDetail.uid}
              markerPosition={cropFieldDetail.markerPosition}
              polygonPoints={cropFieldDetail.polygonPoints}
              fieldParcels={fieldParcels}
              rows={rows.flat()}
              rowRectangles={rowRectangles}
              cropCoords={cropCoords}
              affectedRows={[]}
            />
          </Paper>
        </Box>
        <Box sx={{ flex: 1, p: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 4, fontStyle: "italic" }}
          >
            Here you can view the list of parcels of your field.
          </Typography>
          {!isLoading && fieldParcels.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                margin: "auto",
                flexDirection: "column",
                maxWidth: 360,
                maxHeight: 450,
                gap: 1,
                overflowX: "hidden",
                overflowY: "scroll",
              }}
            >
              <List
                subheader={
                  <ListSubheader
                    sx={{ fontWeight: "bold", lineHeight: "40px" }}
                  >
                    Field parcels list
                    <Divider />
                  </ListSubheader>
                }
              >
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
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          onClick={(e) => handleParcelUpdateClick(e, parcel)}
                        >
                          <UpdateIcon />
                        </IconButton>
                        <IconButton
                          onClick={(e) =>
                            handleParcelDeleteClick(e, parcel.uid)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              {cropFieldDetail.polygonPoints.length > 3 && <AddParcelButton />}
            </Box>
          ) : (
            <ColumnCenterContainer>
              <Typography
                variant="h5"
                sx={{
                  color: "text.secondary",
                  fontStyle: "italic",
                  fontWeight: "bold",
                  letterSpacing: "0.05rem",
                }}
              >
                You have no field parcels added.
              </Typography>
              {cropFieldDetail.polygonPoints.length > 3 && <AddParcelButton />}
            </ColumnCenterContainer>
          )}
        </Box>
      </Box>
      {deleteParcelOpen && (
        <DeleteFieldParcelDialog
          onConfirmDelete={handleParcelDelete}
          onConfirmCancel={handleParcelDeleteCancel}
          open={deleteParcelOpen}
        />
      )}
    </Box>
  );
}

export default CropFieldInfoPanel;
