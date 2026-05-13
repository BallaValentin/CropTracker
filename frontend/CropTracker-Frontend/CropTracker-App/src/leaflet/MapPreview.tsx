import { Box } from "@mui/material";
import {
  LayersControl,
  MapContainer,
  Marker,
  Polygon,
  useMap,
} from "react-leaflet";
import CustomLayerControl from "./CustomLayers";
import type { LatLngObject } from "../interfaces/LatLngObject";
import L from "leaflet";
import { useEffect } from "react";
import { defaultMapPosition } from "../utils/Constants";

interface MapPreviewProps {
  mapHeight: number;
  isScrollable: boolean;
  isDraggable: boolean;
  isZoomable: boolean;
  setBounds: boolean;
  uid: string;
  markerPosition: LatLngObject | null;
  polygonPoints: LatLngObject[];
}

interface MapBoundsHelperProps {
  polygonPoints: LatLngObject[];
}

function MapPreview({
  mapHeight,
  isScrollable,
  isDraggable,
  isZoomable,
  setBounds,
  uid,
  markerPosition,
  polygonPoints,
}: MapPreviewProps) {
  const MapBoundsHelper = ({ polygonPoints }: MapBoundsHelperProps) => {
    const map = useMap();
    useEffect(() => {
      if (setBounds && polygonPoints && polygonPoints.length > 3) {
        const polygon = new L.Polygon(polygonPoints);
        const bounds = polygon.getBounds();

        map.fitBounds(bounds, {
          padding: [20, 20],
        });
      }
    }, [polygonPoints, map]);
    return null;
  };

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
          scrollWheelZoom={isScrollable}
          dragging={isDraggable}
          zoomControl={isZoomable}
          style={{ height: "100%", width: "100%" }}
        >
          <MapBoundsHelper polygonPoints={polygonPoints} />
          <LayersControl position="topright">
            <CustomLayerControl />
          </LayersControl>

          <Polygon
            key={uid ? "polygon-" + uid : "default-polygon"}
            positions={polygonPoints}
            pathOptions={{ color: "blue" }}
          />

          {markerPosition != null && (
            <Marker
              key={uid ? "marker-" + uid : "default-marker"}
              position={[markerPosition.lat, markerPosition.lng]}
            />
          )}
        </MapContainer>
      </Box>
    </>
  );
}

export default MapPreview;
