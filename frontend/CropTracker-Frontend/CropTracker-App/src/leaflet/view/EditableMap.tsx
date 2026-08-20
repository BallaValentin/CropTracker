import { LayersControl, MapContainer } from "react-leaflet";
import { useEffect, useState } from "react";
import { Marker, Polygon, Tooltip } from "react-leaflet";
import { defaultMapPosition } from "../../utils/Constants";
import { Box, Paper } from "@mui/material";
import CustomLayers from "../helper/CustomLayers";
import CropFieldDrawControl from "../control/CropFieldDrawControl";
import type { LatLngObject } from "../../interfaces/helper/LatLngObject";
import { calculatePolygonArea } from "../../utils/PolygonHelper";
import ColumnCenterContainer from "../../elements/containers/ColumnCenterContainer";
import ProgressCircle from "../../elements/progress/ProgressCircle";

interface EditableMapProps {
  hasMarker?: boolean;
  markerPosition: LatLngObject | null;
  polygonPoints: LatLngObject[];
  markerAdded: boolean;
  onMarkerCreated: (latLng: LatLngObject) => void;
  onMarkerDeleted: () => void;
  onPolygonCreated: (latLngs: LatLngObject[]) => void;
  onPolygonDeleted: () => void;
}

function EditableMap({
  hasMarker = false,
  markerPosition,
  polygonPoints,
  markerAdded,
  onMarkerCreated,
  onMarkerDeleted,
  onPolygonCreated,
  onPolygonDeleted,
}: EditableMapProps) {
  const [area, setArea] = useState<number>(0);
  const [viewCenter, setViewCenter] = useState<[number, number] | null>(null);
  const [locationReady, setLocationReady] = useState(false);

  useEffect(() => {
    if (!hasMarker) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log("A");
          const { latitude, longitude } = pos.coords;
          setViewCenter([latitude, longitude]);
          setLocationReady(true);
        },
        (err) => {
          console.log(err.message);
          setViewCenter([0, defaultMapPosition.lng]);
          setLocationReady(true);
        },
      );
    }
  }, [hasMarker]);

  useEffect(() => {
    if (hasMarker && markerPosition && !locationReady) {
      setViewCenter([markerPosition.lat, markerPosition.lng]);
      setLocationReady(true);
    }
  }, [hasMarker, markerPosition, locationReady]);

  useEffect(() => {
    if (polygonPoints && polygonPoints.length > 3) {
      setArea(calculatePolygonArea(polygonPoints) || 0);
    }
  }, [polygonPoints]);

  if (!locationReady || !viewCenter) {
    return (
      <Box
        sx={{
          height: 600,
          width: "100%",
          bgcolor: "grey.100",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Box sx={{ height: "100%" }}>
          <ColumnCenterContainer>
            <ProgressCircle loadingMessage="Loading map..." />
          </ColumnCenterContainer>
        </Box>
      </Box>
    );
  }

  const handlePolygonCreated = (formattedPoints: LatLngObject[]) => {
    onPolygonCreated(formattedPoints);
  };

  const handleMarkerCreated = (markerPoint: LatLngObject) => {
    onMarkerCreated(markerPoint);
  };

  const handlePolygonDeleted = () => {
    onPolygonDeleted();
  };

  const handleMarkerDeleted = () => {
    onMarkerDeleted();
  };

  return (
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
      <MapContainer style={{ height: "100%" }} center={viewCenter} zoom={16}>
        <LayersControl position="topright">
          <CustomLayers />

          <CropFieldDrawControl
            markerAdded={markerAdded}
            markerPosition={markerPosition || defaultMapPosition}
            polygonPoints={polygonPoints}
            onPolygonCreated={handlePolygonCreated}
            onPolygonDeleted={handlePolygonDeleted}
            onMarkerCreated={handleMarkerCreated}
            onMarkerDeleted={handleMarkerDeleted}
          />

          {markerAdded && markerPosition && (
            <Marker
              key={"cropfield_marker"}
              position={[markerPosition.lat, markerPosition.lng]}
            />
          )}

          {polygonPoints.length >= 3 && (
            <Polygon
              key={"cropfield-polygon"}
              positions={polygonPoints}
              pathOptions={{ color: "gray" }}
              eventHandlers={{
                mouseover: (e) => e.target.setStyle({ fillOpacity: 0.7 }),
                mouseout: (e) => e.target.setStyle({ fillOpacity: 0.2 }),
              }}
            >
              <Tooltip direction="top" className="area-tooltip" opacity={1}>
                {`Area: ${(area / 10000).toFixed(2)} ha`}
              </Tooltip>
            </Polygon>
          )}
        </LayersControl>
      </MapContainer>
    </Paper>
  );
}

export default EditableMap;
