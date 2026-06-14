import { LayersControl, MapContainer } from "react-leaflet";
import { useEffect, useState } from "react";
import { Marker, Polygon, Tooltip } from "react-leaflet";
import { defaultMapPosition } from "../utils/Constants";
import { Paper } from "@mui/material";
import CustomLayers from "./CustomLayers";
import CropFieldDrawControl from "./CropFieldDrawControl";
import type { LatLngObject } from "../interfaces/LatLngObject";
import { calculatePolygonArea } from "../utils/PolygonHelper";
import ChangeView from "./ChangeView";

interface EditableMapProps {
  canLoadMap?: boolean;
  markerPosition: LatLngObject | null;
  polygonPoints: LatLngObject[];
  markerAdded: boolean;
  onMarkerCreated: (latLng: LatLngObject) => void;
  onMarkerDeleted: () => void;
  onPolygonCreated: (latLngs: LatLngObject[]) => void;
  onPolygonDeleted: () => void;
}

function EditableMap({
  canLoadMap = true,
  markerPosition,
  polygonPoints,
  markerAdded,
  onMarkerCreated,
  onMarkerDeleted,
  onPolygonCreated,
  onPolygonDeleted,
}: EditableMapProps) {
  const [area, setArea] = useState<number>(0);

  useEffect(() => {
    if (polygonPoints && polygonPoints.length > 3) {
      setArea(calculatePolygonArea(polygonPoints) || 0);
    }
  }, [polygonPoints]);

  if (!canLoadMap) return null;

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
      <MapContainer
        style={{ height: "100%" }}
        center={[defaultMapPosition.lat, defaultMapPosition.lng]}
        zoom={16}
      >
        <ChangeView
          center={
            markerPosition
              ? [markerPosition.lat, markerPosition.lng]
              : [defaultMapPosition.lat, defaultMapPosition.lng]
          }
        />
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
                `Area: ${(area / 10000).toFixed(2)} ha`
              </Tooltip>
            </Polygon>
          )}
        </LayersControl>
      </MapContainer>
    </Paper>
  );
}

export default EditableMap;
