import { FeatureGroup, useMap } from "react-leaflet";
import L from "leaflet";
import type { DrawEvents } from "leaflet";
import { EditControl } from "react-leaflet-draw";
import { polygon as turfPolygon } from "@turf/helpers";
import area from "@turf/area";
import { blueCircleIcon } from "../elements/icons/BlueCircleIcon";

interface MapEventsHelperProps {
  onPolygonCreated: (rawLatLngs: L.LatLng[], area: number) => void;
  onMarkerCreated: (rawLatLng: L.LatLng) => void;
}
function MapEventsHelper({
  onPolygonCreated,
  onMarkerCreated,
}: MapEventsHelperProps) {
  const map = useMap();

  const _onCreated = (e: DrawEvents.Created) => {
    const { layer, layerType } = e;
    const currentZoom = map.getZoom();
    const currentCenter = map.getCenter();

    map.fire("draw:drawstop");

    if (layerType === "polygon") {
      const polygonLayer = layer as L.Polygon;
      const rawLatLngs = polygonLayer.getLatLngs();
      const latLngs = rawLatLngs[0] as L.LatLng[];
      const coords = latLngs.map((latLng: L.LatLng) => [
        latLng.lat,
        latLng.lng,
      ]);

      coords.push(coords[0]);
      const polygonFeature = turfPolygon([coords]);
      const areaInSquareMeters = area(polygonFeature);

      onPolygonCreated(rawLatLngs as L.LatLng[], areaInSquareMeters);
    } else if (layerType === "marker") {
      const markerLayer = layer as L.Marker;
      const rawLatLng = markerLayer.getLatLng();
      onMarkerCreated(rawLatLng);
    }

    setTimeout(() => {
      layer.remove();
      map.setView(currentCenter, currentZoom, { animate: false });
    }, 10);
  };

  return (
    <FeatureGroup>
      <EditControl
        position="topright"
        onCreated={_onCreated}
        draw={{
          marker: true,
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
              message: "<strong>Error:<strong> shape edges cannot intersect!",
            },
            icon: blueCircleIcon,
            shapeOptions: {
              clickable: true,
              color: "#3388FF",
            },
          },
        }}
      />
    </FeatureGroup>
  );
}

export default MapEventsHelper;
