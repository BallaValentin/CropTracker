import {
  Box,
  Button,
  Divider,
  List,
  ListSubheader,
  Paper,
  Typography,
} from "@mui/material";
import ColumnCenterContainer from "../containers/ColumnCenterContainer";
import type { GetCropFieldDTO } from "../../interfaces/response/GetCropFieldDTO";
import AddIcon from "@mui/icons-material/Add";
import type { GetFieldParcelDTO } from "../../interfaces/response/GetFieldParcelDTO";
import { useEffect, useState } from "react";
import DeleteFieldParcelDialog from "../dialogs/DeleteFieldParcelDialog";
import FieldDetailMapPreview from "../../leaflet/view/FieldDetailMapPreview";
import type { LatLngObject } from "../../interfaces/helper/LatLngObject";
import {
  getGeneratedCrops,
  getGeneratedRectabgles,
  getGeneratedRows,
} from "../../utils/GenerateShapesUtil";
import FieldParcelItem from "../listItems/FieldParcelItem";

interface CropFieldInfoPanelProps {
  isLoading: boolean;
  cropFieldDetail: GetCropFieldDTO;
  fieldParcels: GetFieldParcelDTO[];
  parcelsSelected: boolean[];
  onAddParcelClick: () => void;
  onUpdateParcelClick: (fieldParcel: GetFieldParcelDTO) => void;
  onConfirmDelete: (fieldParcelId: string) => void;
  onParcelSelected: (index: number) => void;
}

function CropFieldInfoPanel({
  isLoading,
  fieldParcels,
  parcelsSelected,
  cropFieldDetail,
  onAddParcelClick,
  onUpdateParcelClick,
  onConfirmDelete,
  onParcelSelected,
}: CropFieldInfoPanelProps) {
  const [rows, setRows] = useState<LatLngObject[][][]>([]);
  const [rowRectangles, setRowRectangles] = useState<LatLngObject[][]>([]);
  const [cropCoords, setCropCoords] = useState<LatLngObject[]>([]);
  const [deleteParcelOpen, setDeleteParcelOpen] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState("");

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

  const handleParcelDeleteClick = (fieldParcelId: string) => {
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

  const handleParcelUpdate = (fieldParcel: GetFieldParcelDTO) => {
    onUpdateParcelClick(fieldParcel);
  };

  const handleParcelExpand = (index: number) => {
    onParcelSelected(index);
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
              parcelsSelected={parcelsSelected}
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
                maxWidth: 400,
                maxHeight: 450,
                gap: 1,
                overflowX: "hidden",
                overflowY: "scroll",
              }}
            >
              <List
                sx={{
                  width: "100%",
                  "& .MuiListItem-root": { my: 0, py: 0.25 },
                }}
                disablePadding
                subheader={
                  <ListSubheader
                    sx={{ fontWeight: "bold", lineHeight: "40px" }}
                  >
                    Field parcels list
                    <Divider
                      sx={{ borderBottomWidth: 2.5, borderColor: "grey.300" }}
                    />
                  </ListSubheader>
                }
              >
                {fieldParcels.map((parcel, index) => (
                  <FieldParcelItem
                    key={index}
                    parcel={parcel}
                    selected={parcelsSelected[index]}
                    index={index}
                    onParcelExpand={handleParcelExpand}
                    onParcelUpdate={handleParcelUpdate}
                    onParcelDelete={handleParcelDeleteClick}
                  />
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
