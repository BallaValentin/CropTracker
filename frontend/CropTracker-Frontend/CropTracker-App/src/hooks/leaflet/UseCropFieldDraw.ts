import { useMap } from "react-leaflet";
import type { LatLngObject } from "../../interfaces/helper/LatLngObject";
import { getPolygonCenter, isPointInPolygon } from "../../utils/PolygonHelper";
import * as L from "leaflet";
import { showMapWarning } from "../../leaflet/helper/ShowMapWarning";

interface UseCropFieldDrawProps {
    markerAdded: boolean,
    markerPosition: LatLngObject,
    polygonPoints: LatLngObject[],
    onPolygonCreated: (polygonPoints: LatLngObject[]) => void;
    onPolygonDeleted: () => void;
    onMarkerCreated: (markerPoint: LatLngObject) => void;
    onMarkerDeleted: () => void;
}

export const useCropFieldDraw = ({markerAdded, 
  markerPosition, polygonPoints, onPolygonCreated, onPolygonDeleted, onMarkerCreated, 
  onMarkerDeleted}: UseCropFieldDrawProps) => {
    const map = useMap();

    const _onCreated = (e: { layer: L.Layer; shape: string }) => {
      const { layer, shape } = e;
      const currentZoom = map.getZoom();
      const currentCenter = map.getCenter();

      map.fire("draw:drawstop");

      if (shape === "Polygon") {
        const polygonLayer = layer as L.Polygon;
        const rawLatLngs = polygonLayer.getLatLngs();
        const latLngs = rawLatLngs[0] as L.LatLng[];
        const formattedPoints = latLngs.map((latLng) => ({
          lat: latLng.lat,
          lng: latLng.lng,
        }));

        if (!markerAdded || isPointInPolygon(markerPosition, formattedPoints)) {
          onPolygonCreated(formattedPoints);

          if (!markerAdded) {
            const centerMarker = getPolygonCenter(formattedPoints);
            onMarkerCreated(centerMarker);
          }
        } else {
          showMapWarning(map, polygonLayer.getBounds().getCenter(), "The marker must be placed inside the polygon.");
        }
      } else if (shape === "Marker") {
        const markerLayer = layer as L.Marker;
        const rawLatLng = markerLayer.getLatLng();

        if (
          polygonPoints.length === 0 ||
          isPointInPolygon(rawLatLng, polygonPoints)
        ) {
          onMarkerCreated(rawLatLng);
        } else {
          showMapWarning(map, markerLayer.getLatLng(), "The marker must be placed inside the polygon.");
        }
      }

      setTimeout(() => {
        layer.remove();
        map.setView(currentCenter, currentZoom, { animate: false });
      }, 10);
    };

    const _onUpdated = (layer: L.Layer) => {
      const currentZoom = map.getZoom();
      const currentCenter = map.getCenter();
        
      if (layer instanceof L.Polygon) {

          const polygonLayer = layer as L.Polygon;
          const rawLatLngs = polygonLayer.getLatLngs();
          const latLngs = rawLatLngs[0] as L.LatLng[];
          const formattedPoints = latLngs.map((latLng) => ({
          lat: latLng.lat,
          lng: latLng.lng,
          }));

          if (!markerAdded || isPointInPolygon(markerPosition, formattedPoints)) {
            onPolygonCreated(formattedPoints);

            if (!markerAdded) {
                const centerMarker = getPolygonCenter(formattedPoints);
                onMarkerCreated(centerMarker);
            }
          } else {
            showMapWarning(map, polygonLayer.getBounds().getCenter(), "The marker must be placed inside the polygon.");
            }
      };
        setTimeout(() => {
        map.setView(currentCenter, currentZoom, { animate: false });
      }, 10);
    }

    const _onDeleted = (e: { layer: L.Layer; shape: string }) => {
      const {layer} = e;
      const currentZoom = map.getZoom();
      const currentCenter = map.getCenter();

        if (layer instanceof L.Polygon) {
          onPolygonDeleted();
        } else if (layer instanceof L.Marker) {
          onMarkerDeleted();
        }
      ;

      setTimeout(() => {
        map.setView(currentCenter, currentZoom, { animate: false });
      }, 10);
    };

    return {_onCreated, _onDeleted, _onUpdated}
}