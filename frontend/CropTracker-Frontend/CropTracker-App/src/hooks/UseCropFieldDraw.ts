import { useMap } from "react-leaflet";
import type { GetCropFieldDTO } from "../interfaces/response/GetCropFieldDTO";
import type { LatLngObject } from "../interfaces/LatLngObject";
import { getPolygonCenter, isPointInPolygon } from "../utils/PolygonHelper";
import L from "leaflet";

interface UseCropFieldDrawProps {
    markerAdded: boolean,
    cropFieldData: GetCropFieldDTO,
    onPolygonCreated: (polygonPoints: LatLngObject[]) => void;
    onPolygonDeleted: () => void;
    onMarkerCreated: (markerPoint: LatLngObject) => void;
    onMarkerDeleted: () => void;
}

export const useCropFieldDraw = ({markerAdded, cropFieldData, onPolygonCreated, onPolygonDeleted, onMarkerCreated, onMarkerDeleted}: UseCropFieldDrawProps) => {
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

        if (
          !markerAdded ||
          (cropFieldData.markerPosition &&
            isPointInPolygon(cropFieldData.markerPosition, formattedPoints))
        ) {
          onPolygonCreated(formattedPoints);

          if (!markerAdded) {
            const centerMarker = getPolygonCenter(formattedPoints);
            onMarkerCreated(centerMarker);
          }
        } else {
          alert(
            "The polygon must contain the marker. Please draw a polygon that includes the marker.",
          );
        }
      } else if (shape === "Marker") {
        const markerLayer = layer as L.Marker;
        const rawLatLng = markerLayer.getLatLng();

        if (
          cropFieldData.polygonPoints.length === 0 ||
          isPointInPolygon(rawLatLng, cropFieldData.polygonPoints)
        ) {
          onMarkerCreated(rawLatLng);
        } else {
          alert(
            "The marker must be placed inside the polygon. Please place the marker within the existing polygon.",
          );
        }
      }

      setTimeout(() => {
        layer.remove();
        map.setView(currentCenter, currentZoom, { animate: false });
      }, 10);
    };

    const _onUpdated = (layer: L.Layer) => {
        
        if (layer instanceof L.Polygon) {

            const polygonLayer = layer as L.Polygon;
            const rawLatLngs = polygonLayer.getLatLngs();
            const latLngs = rawLatLngs[0] as L.LatLng[];
            const formattedPoints = latLngs.map((latLng) => ({
            lat: latLng.lat,
            lng: latLng.lng,
            }));

            if (
            !markerAdded ||
            (cropFieldData.markerPosition &&
                isPointInPolygon(cropFieldData.markerPosition, formattedPoints))
            ) {
            onPolygonCreated(formattedPoints);

            if (!markerAdded) {
                const centerMarker = getPolygonCenter(formattedPoints);
                onMarkerCreated(centerMarker);
            }
            } else {
            alert(
                "The polygon must contain the marker. Please draw a polygon that includes the marker.",
            );
            }
        }
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