import { Box } from "@mui/material";
import { LayersControl, MapContainer, Marker, Polygon } from "react-leaflet";
import CustomLayerControl from "./CustomLayers";
import type { LatLngObject } from "../interfaces/LatLngObject";

interface MapPreviewProps {
  uid: string;
  latitude: number;
  longitude: number;
  polygonPoints: LatLngObject[];
}

function MapPreview({
  uid,
  latitude,
  longitude,
  polygonPoints,
}: MapPreviewProps) {
  console.log("MapPreview props:", { latitude, longitude });
  return (
    <>
      <Box
        sx={{
          height: 300,
          width: "97%",
          margin: 3,
          overflow: "hidden",
        }}
      >
        <MapContainer
          center={[latitude, longitude]}
          zoom={13}
          scrollWheelZoom={false}
          dragging={false}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
        >
          <LayersControl position="topright">
            <CustomLayerControl />
          </LayersControl>

          <Polygon
            key={`plot-${uid}`}
            positions={polygonPoints}
            pathOptions={{ color: "blue" }}
          />

          <Marker position={[latitude, longitude]} />
        </MapContainer>
      </Box>
    </>
  );
}

export default MapPreview;
