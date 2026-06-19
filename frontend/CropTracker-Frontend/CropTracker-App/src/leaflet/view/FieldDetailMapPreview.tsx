import { Box } from "@mui/material";
import { LayersControl, MapContainer, Polygon } from "react-leaflet";
import CustomLayerControl from "../helper/CustomLayers";
import type { LatLngObject } from "../../interfaces/helper/LatLngObject";
import { defaultMapPosition } from "../../utils/Constants";
import type { GetFieldParcelDTO } from "../../interfaces/response/GetFieldParcelDTO";
import MapDetailZoomControl from "../control/MapDetailZoomControl";
import MapBoundsHelper from "../helper/MapBoundsHelper";

interface FieldDetailMapPreviewProps {
  mapHeight: number;
  uid: string;
  markerPosition: LatLngObject | null;
  polygonPoints: LatLngObject[];
  fieldParcels: GetFieldParcelDTO[];
  parcelsSelected: boolean[];
  rows: LatLngObject[][];
  rowRectangles: LatLngObject[][];
  cropCoords: LatLngObject[];
  affectedRows: boolean[];
}

function FieldDetailMapPreview({
  mapHeight,
  uid,
  markerPosition,
  polygonPoints,
  fieldParcels,
  parcelsSelected,
  rows,
  rowRectangles,
  cropCoords,
  affectedRows,
}: FieldDetailMapPreviewProps) {
  return (
    <>
      <Box
        sx={{
          height: mapHeight,
          width: "100%",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        <MapContainer
          key={`${markerPosition?.lat}-${markerPosition?.lng}`}
          center={
            markerPosition != null
              ? [markerPosition.lat, markerPosition.lng]
              : [defaultMapPosition.lat, defaultMapPosition.lng]
          }
          zoom={13}
          scrollWheelZoom={true}
          dragging={true}
          zoomControl={true}
          style={{ height: "100%", width: "100%" }}
        >
          {polygonPoints && polygonPoints.length > 3 && (
            <MapBoundsHelper polygonPoints={polygonPoints} />
          )}

          <LayersControl position="topright">
            <CustomLayerControl />
          </LayersControl>

          {fieldParcels.map((parcel, index) => (
            <Polygon
              key={parcel.uid}
              positions={parcel.polygonPoints}
              pathOptions={{
                color: parcel.polygonColor || "blue",
                fillColor: parcelsSelected[index] ? "green" : "lightgreen",
                fillOpacity: parcelsSelected[index] ? 0.5 : 0.2,
                weight: parcelsSelected[index] ? 6 : 2,
              }}
            />
          ))}

          <MapDetailZoomControl
            rows={rows}
            rowRectangles={rowRectangles}
            cropCoords={cropCoords}
            affectedRows={affectedRows || []}
          />

          <Polygon
            key={uid ? "polygon-" + uid : "default-polygon"}
            positions={polygonPoints}
            pathOptions={{ color: "gray" }}
          />
        </MapContainer>
      </Box>
    </>
  );
}

export default FieldDetailMapPreview;
