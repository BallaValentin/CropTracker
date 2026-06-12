import { LayersControl, MapContainer } from "react-leaflet";
import type { GetCropFieldDTO } from "../interfaces/response/GetCropFieldDTO";
import { useEffect, useState } from "react";
import { Marker, Polygon, Tooltip } from "react-leaflet";
import { defaultMapPosition } from "../utils/Constants";
import { Paper } from "@mui/material";
import CustomLayers from "./CustomLayers";
import ChangeView from "./ChangeView";
import CropFieldDrawControl from "./CropFieldDrawControl";
import type { LatLngObject } from "../interfaces/LatLngObject";
import { calculatePolygonArea } from "../utils/PolygonHelper";

interface EditableMapProps {
  cropField: GetCropFieldDTO;
  markerAdded: boolean;
  onMarkerCreated: (latLng: LatLngObject) => void;
  onMarkerDeleted: () => void;
  onPolygonCreated: (latLngs: LatLngObject[]) => void;
  onPolygonDeleted: () => void;
}

function EditableMap({
  cropField,
  markerAdded,
  onMarkerCreated,
  onMarkerDeleted,
  onPolygonCreated,
  onPolygonDeleted,
}: EditableMapProps) {
  const [cropFieldData, setCropFieldData] =
    useState<GetCropFieldDTO>(cropField);
  const [viewCenter, setViewCenter] = useState<[number, number]>(
    cropField.markerPosition
      ? [cropField.markerPosition.lat, cropField.markerPosition.lng]
      : [defaultMapPosition.lat, defaultMapPosition.lng],
  );

  const handlePolygonCreated = (formattedPoints: LatLngObject[]) => {
    setCropFieldData((prev) => ({
      ...prev,
      polygonPoints: formattedPoints,
      area: calculatePolygonArea(formattedPoints),
    }));
    onPolygonCreated(formattedPoints);
  };

  const handleMarkerCreated = (markerPoint: LatLngObject) => {
    setCropFieldData((prev) => ({
      ...prev,
      markerPosition: markerPoint,
    }));

    setViewCenter([markerPoint.lat, markerPoint.lng]);

    onMarkerCreated(markerPoint);
  };

  const handlePolygonDeleted = () => {
    setCropFieldData((prev) => ({
      ...prev,
      polygonPoints: [],
      area: 0,
    }));
    onPolygonDeleted();
  };

  const handleMarkerDeleted = () => {
    setCropFieldData((prev) => ({
      ...prev,
      markerPosition: defaultMapPosition,
    }));
    onMarkerDeleted();
  };

  useEffect(() => {
    setCropFieldData(cropField);
    setViewCenter(
      cropField.markerPosition
        ? [cropField.markerPosition.lat, cropField.markerPosition.lng]
        : [defaultMapPosition.lat, defaultMapPosition.lng],
    );
  }, [cropField]);

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
      <MapContainer style={{ height: "100%" }} center={viewCenter} zoom={13}>
        <LayersControl position="topright">
          <CustomLayers />

          <ChangeView center={viewCenter} zoom={16} />

          <CropFieldDrawControl
            markerAdded={markerAdded}
            cropFieldData={cropFieldData}
            onPolygonCreated={handlePolygonCreated}
            onPolygonDeleted={handlePolygonDeleted}
            onMarkerCreated={handleMarkerCreated}
            onMarkerDeleted={handleMarkerDeleted}
          />

          {markerAdded && cropFieldData.markerPosition && (
            <Marker
              key={
                cropFieldData.uid
                  ? "marker-" + cropFieldData.uid
                  : "default-marker"
              }
              position={[
                cropFieldData.markerPosition.lat,
                cropFieldData.markerPosition.lng,
              ]}
            />
          )}

          {cropFieldData.polygonPoints.length > 0 && (
            <Polygon
              key={
                cropFieldData.uid
                  ? "polygon-" + cropFieldData.uid
                  : "default-polygon"
              }
              positions={cropFieldData.polygonPoints}
              pathOptions={{ color: "gray" }}
              eventHandlers={{
                mouseover: (e) => e.target.setStyle({ fillOpacity: 0.7 }),
                mouseout: (e) => e.target.setStyle({ fillOpacity: 0.2 }),
              }}
            >
              <Tooltip direction="top" className="area-tooltip" opacity={1}>
                Area: {(cropField.area / 10000).toFixed(2)} ha
              </Tooltip>
            </Polygon>
          )}
        </LayersControl>
      </MapContainer>
    </Paper>
  );
}

export default EditableMap;
