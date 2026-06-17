import L from "leaflet";
import { useRef, useState } from "react";
import { useMap } from "react-leaflet";
import type { GeomanVertexEvent } from "../../interfaces/leaflet/GeomanVertexEvent";

export const useMapDistance = () => {
    const map = useMap();
    const verticesRef = useRef<L.LatLng[]>([]);
    const tooltipRef = useRef<L.Tooltip | null>(null);
    const [drawnVertices, setDrawnVertices] = useState<L.LatLng[]>([]);

    const _onMouseMove = (event: L.LeafletMouseEvent) => {
      if (verticesRef.current.length === 0 || !tooltipRef.current) return;

      const cursorLatLng  = event.latlng;

      const distance = verticesRef.current[verticesRef.current.length - 1].distanceTo(cursorLatLng);

      const formattedDistance = distance > 1000 ? `${(distance/1000).toFixed(2)} km` : `${Math.round(distance)} m`;

      tooltipRef.current
        .setLatLng(cursorLatLng)
        .setContent(`Distance: ${formattedDistance}`)
        .addTo(map);
    }

    const _onDrawStart = (event: L.LeafletEvent) => {
      console.log("Draw start event");
      const geomanEvent = event as GeomanVertexEvent;

      if (geomanEvent.shape === "Polygon" || geomanEvent.shape === "Line") {
        tooltipRef.current = L.tooltip({
                permanent: true,
                direction: "right",
                className: "distance-tooltip",
              });

        if (geomanEvent.shape === "Line") {
        const polylineLayer = geomanEvent.workingLayer;
        polylineLayer.options.snapIgnore = true;
        }

        map.on('mousemove', _onMouseMove);
        geomanEvent.workingLayer.on('pm:vertexadded', (vertexEvent: L.LeafletEvent) => {
          console.log("Drawn a vertex");
        const geomanVertexEvent = vertexEvent as GeomanVertexEvent;
      
        setDrawnVertices((prev) => {
          const updated = [...prev, geomanVertexEvent.latlng];

          verticesRef.current = updated;
          return updated;
        });

        if (geomanVertexEvent.shape === "Line" && verticesRef.current.length === 2) {
          console.log("Vertex length reached for line")
         const drawContext = map.pm.Draw;
         const finishFn = Reflect.get(drawContext.Line, '_finishShape') as (() => void) | undefined;

         if (typeof finishFn === 'function') {
          finishFn.call(drawContext.Line);
        }
      }

        });

        geomanEvent.workingLayer.on('pm:vertexremoved', () => {
          const newDrawnVertexes = [...drawnVertices];
          newDrawnVertexes.pop();
          setDrawnVertices((prev) => {
            const updated = [...prev];
            updated.pop();

            verticesRef.current = updated;
            return updated;
          });
        });
      }
    }

    const _onDrawEnd = () => {
      console.log("Draw end event");
      map.off('mousemove', _onMouseMove);
      verticesRef.current = [];
      setDrawnVertices([]);

      if (tooltipRef.current) {
        tooltipRef.current.remove();
        tooltipRef.current = null;
      }
    }

    return {_onDrawStart, _onDrawEnd}
}