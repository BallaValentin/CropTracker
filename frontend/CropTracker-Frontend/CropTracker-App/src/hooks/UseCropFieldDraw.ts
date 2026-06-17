import { useMap } from "react-leaflet";
import type { LatLngObject } from "../interfaces/LatLngObject";
import { getPolygonCenter, isPointInPolygon } from "../utils/PolygonHelper";
import L from "leaflet";

interface UseCropFieldDrawProps {
    markerAdded: boolean,
    markerPosition: LatLngObject,
    polygonPoints: LatLngObject[],
    onPolygonCreated: (polygonPoints: LatLngObject[]) => void;
    onPolygonDeleted: () => void;
    onMarkerCreated: (markerPoint: LatLngObject) => void;
    onMarkerDeleted: () => void;
    lastPointRef: React.RefObject<L.LatLng | null>;
    tooltipRef: React.RefObject<L.Tooltip | null>;
}

interface GeomanVertexEvent extends L.LeafletEvent {
  latlng: L.LatLng;
  marker: L.Marker;
  workingLayer: L.Layer;
  shape: string;
}

export const useCropFieldDraw = ({markerAdded, 
  markerPosition, polygonPoints, onPolygonCreated, onPolygonDeleted, onMarkerCreated, 
  onMarkerDeleted, lastPointRef, tooltipRef}: UseCropFieldDrawProps) => {
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
          alert(
            "The polygon must contain the marker. Please draw a polygon that includes the marker.",
          );
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
            alert(
                "The polygon must contain the marker. Please draw a polygon that includes the marker.",
            );
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

    const _onMouseMove = (event: L.LeafletMouseEvent) => {
      if (!lastPointRef.current || !tooltipRef.current) return;

      const cursorLatLng  = event.latlng;

      const distance = lastPointRef.current.distanceTo(cursorLatLng);

      const formattedDistance = distance > 1000 ? `${(distance/1000).toFixed(2)} km` : `${Math.round(distance)} m`;

      console.log(formattedDistance);

      tooltipRef.current
        .setLatLng(cursorLatLng)
        .setContent(`Distance: ${formattedDistance}`)
        .addTo(map);
    }

    const _onDrawStart = (event: L.LeafletEvent) => {
      const geomanEvent = event as GeomanVertexEvent;
      if (geomanEvent.shape === "Polygon") {
        map.on('mousemove', _onMouseMove)
        geomanEvent.workingLayer.on('pm:vertexadded', (vertexEvent: L.LeafletEvent) => {
        const geomanVertexEvent = vertexEvent as GeomanVertexEvent;
        console.log('New vertex coordinate:', geomanVertexEvent.latlng);
      
        lastPointRef.current = geomanVertexEvent.latlng;
        });
      }
    }

    const _onDrawVertex = (event: L.LeafletEvent) => {
      const geomanEvent = event as GeomanVertexEvent;
      lastPointRef.current = geomanEvent.latlng;
    }

    const _onDrawEnd = () => {
      map.off('mousemove', _onMouseMove);
      lastPointRef.current = null;

      if (tooltipRef.current) {
        tooltipRef.current.remove();
      }
    }

    return {_onCreated, _onDeleted, _onUpdated, _onDrawStart, _onDrawVertex, _onDrawEnd}
}