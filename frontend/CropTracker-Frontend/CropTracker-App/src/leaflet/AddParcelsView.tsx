import { Box } from "@mui/material";
import {
  FeatureGroup,
  LayersControl,
  MapContainer,
  Polygon,
} from "react-leaflet";
import type { LatLngObject } from "../interfaces/LatLngObject";
import { defaultMapPosition } from "../utils/Constants";
import CustomLayers from "./CustomLayers";
import { EditControl } from "react-leaflet-draw";
import { circleIcon } from "../elements/icons/CircleIcon";
import L from "leaflet";
import * as turf from "@turf/turf";
import SnapDrawing from "./SnapDrawing";

interface AddParcelViewProps {
  polygonPoints: LatLngObject[];
  markerPosition: LatLngObject | null;
  uid: string;
  mapHeight: number;
  polygonColor: string;
}

function AddParcelView({
  mapHeight,
  markerPosition,
  uid,
  polygonPoints,
  polygonColor,
}: AddParcelViewProps) {
  const snap = (point: LatLngObject, existingPolygon: LatLngObject[]) => {
    const tolerance = 5;
    const clickedPoint = turf.point([point.lng, point.lat]);
    const polygonLatLngs = existingPolygon.map((coord) =>
      L.latLng(coord.lat, coord.lng),
    );
    const polyline = turf.lineString(
      polygonLatLngs.map((latLng) => [latLng.lng, latLng.lat]),
    );

    const closestPointOnBorder = turf.nearestPointOnLine(
      polyline,
      clickedPoint,
    );

    const distanceToBorder = turf.distance(clickedPoint, closestPointOnBorder, {
      units: "meters",
    });

    const isInsidePolygon = turf.booleanPointInPolygon(
      clickedPoint,
      turf.polygon([polyline.geometry.coordinates]),
    );

    if (!isInsidePolygon || distanceToBorder <= tolerance) {
      return new L.LatLng(
        closestPointOnBorder.geometry.coordinates[1],
        closestPointOnBorder.geometry.coordinates[0],
      );
    }

    return new L.LatLng(point.lat, point.lng);
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
          scrollWheelZoom={true}
          dragging={true}
          zoomControl={true}
          style={{ height: "100%", width: "100%" }}
        >
          <FeatureGroup>
            <EditControl
              position="topright"
              draw={{
                marker: false,
                polyline: false,
                circle: false,
                rectangle: false,
                circlemarker: false,
                polygon: {
                  allowIntersection: false,
                  showLength: true,
                  metric: true,
                  drawError: {
                    color: "#e1e100",
                    message:
                      "<strong>Error:<strong> shape edges cannot intersect!",
                  },
                  icon: circleIcon({ color: polygonColor }),
                  shapeOptions: {
                    clickable: true,
                    color: polygonColor,
                  },
                },
              }}
            />
          </FeatureGroup>
          <SnapDrawing onSnap={snap} existingPolygon={polygonPoints} />
          <LayersControl position="topright">
            <CustomLayers />
          </LayersControl>

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

export default AddParcelView;
