import { FeatureGroup, useMap } from "react-leaflet";
import L from "leaflet";
import type { DrawEvents } from "leaflet";
import { EditControl } from "react-leaflet-draw";
import { blueCircleIcon } from "../elements/icons/BlueCircleIcon";

interface MapEventsHelperProps {
  onPolygonCreated: (rawLatLngs: L.LatLng[]) => void;
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
      onPolygonCreated(rawLatLngs as L.LatLng[]);
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
            drawError: {
              color: "#e1e100",
              message: "<strong>Error:<strong> shape edges cannot intersect!",
            },
            icon: blueCircleIcon,
            shapeOptions: {
              color: "#3388FF",
            },
          },
        }}
      />
    </FeatureGroup>
  );
}

export default MapEventsHelper;
