import { type DrawEvents } from "leaflet";
import L from "leaflet";
import { useMap } from "react-leaflet";
import type { LatLngObject } from "../interfaces/LatLngObject";

interface DrawingToolsProps {
  onPolygonCreated: (polygon: LatLngObject[]) => void;
  onPolygonDeleted: () => void;
}

export const useDrawHandler = ({
  onPolygonCreated,
  onPolygonDeleted,
}: DrawingToolsProps) => {
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
      const formattedPoints = latLngs.map((latLng) => ({
        lat: latLng.lat,
        lng: latLng.lng,
      }));

      onPolygonCreated(formattedPoints);
    }

    setTimeout(() => {
      layer.remove();
      map.setView(currentCenter, currentZoom, { animate: false });
    }, 10);
  };

  const _onDeleted = (e: DrawEvents.Deleted) => {
    const { layers } = e;
    const currentZoom = map.getZoom();
    const currentCenter = map.getCenter();

    layers.eachLayer((layer) => {
      if (layer instanceof L.Polygon) {
        onPolygonDeleted();
      }
    });

    setTimeout(() => {
      map.setView(currentCenter, currentZoom, { animate: false });
    }, 10);
  };

  return { _onCreated, _onDeleted };
};
