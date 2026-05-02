import { Box } from "@mui/material";
import { LayersControl, MapContainer, Marker, Polygon } from "react-leaflet";
import CustomLayerControl from "./CustomLayers";
import type { LatLngObject } from "../interfaces/LatLngObject";

interface MapPreviewProps {
  uid: string;
  markerPosition: LatLngObject;
  polygonPoints: LatLngObject[];
}

function MapPreview({ uid, markerPosition, polygonPoints }: MapPreviewProps) {
  console.log("MapPreview props:", { markerPosition });
  return (
    <>
      <Box
        sx={{
          height: 300,
          width: "95%",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        <MapContainer
          center={[markerPosition.lat, markerPosition.lng]}
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
            key={uid ? "polygon-" + uid : "default-polygon"}
            positions={polygonPoints}
            pathOptions={{ color: "blue" }}
          />

          <Marker
            key={uid ? "marker-" + uid : "default-marker"}
            position={[markerPosition.lat, markerPosition.lng]}
          />
        </MapContainer>
      </Box>
    </>
  );
}

export default MapPreview;
