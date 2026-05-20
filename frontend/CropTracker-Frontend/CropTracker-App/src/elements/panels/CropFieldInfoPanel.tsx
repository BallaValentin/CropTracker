import {
  Box,
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
import MapPreview from "../../leaflet/MapPreview";
import AddIcon from "@mui/icons-material/Add";
import type { GetFieldParcelDTO } from "../../interfaces/response/GetFieldParcelDTO";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
import { useState } from "react";
import DeleteFieldParcelDialog from "../dialogs/DeleteFieldParcelDialog";

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
  const AddParcelButton = () => {
    return (
      <IconButton onClick={onAddParcelClick} size="small" color="success">
        <AddIcon />
        Add new field parcel
      </IconButton>
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
            <MapPreview
              mapHeight={600}
              isScrollable={true}
              isDraggable={true}
              isZoomable={true}
              setBounds={false}
              uid={cropFieldDetail.uid}
              markerPosition={cropFieldDetail.markerPosition}
              polygonPoints={cropFieldDetail.polygonPoints}
              fieldParcels={fieldParcels}
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
                maxWidth: 320,
                gap: 1,
              }}
            >
              <List
                subheader={
                  <ListSubheader
                    sx={{ fontWeight: "bold", lineHeight: "40px" }}
                  >
                    Field parcels list
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
