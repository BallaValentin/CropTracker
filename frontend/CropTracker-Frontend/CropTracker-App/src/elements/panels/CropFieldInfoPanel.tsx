import {
  Box,
  IconButton,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import ColumnCenterContainer from "../containers/ColumnCenterContainer";
import type { GetCropFieldDTO } from "../../interfaces/response/GetCropFieldDTO";
import MapPreview from "../../leaflet/MapPreview";
import AddIcon from "@mui/icons-material/Add";

interface CropFieldInfoPanelProps {
  cropFieldDetail: GetCropFieldDTO;
  onAddParcelClick: () => void;
}

function CropFieldInfoPanel({
  cropFieldDetail,
  onAddParcelClick,
}: CropFieldInfoPanelProps) {
  const AddParcelButton = () => {
    return (
      <IconButton onClick={onAddParcelClick} size="small" color="success">
        <AddIcon />
        Add new field parcel
      </IconButton>
    );
  };

  const parcels = cropFieldDetail.fieldParcels ?? [];

  return (
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
        {parcels.length > 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              margin: "auto",
              flexDirection: "column",
            }}
          >
            <List>
              {parcels.map((parcel, index) => (
                <ListItem key={parcel.uid}>Parcel {index}</ListItem>
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
  );
}

export default CropFieldInfoPanel;
