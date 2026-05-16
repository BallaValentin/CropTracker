import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import type { LatLngObject } from "../interfaces/LatLngObject";
import L from "leaflet";

interface SnapDrawingProps {
  existingPolygon: LatLngObject[];
  onSnap: (latLng: L.LatLng, existingPolygon: LatLngObject[]) => L.LatLng;
}

function SnapDrawing({ existingPolygon, onSnap }: SnapDrawingProps) {
  const map = useMap();
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const startDrawing = () => setIsDrawing(true);
    const stopDrawing = () => setIsDrawing(false);

    map.on("draw:drawstart", startDrawing);
    map.on("draw:drawstop", stopDrawing);

    return () => {
      map.off("draw:drawstart", startDrawing);
      map.off("draw:drawstop", stopDrawing);
    };
  }, [map]);

  useEffect(() => {
    if (!isDrawing) return;

    const originalLayerPointToLatLng = map.layerPointToLatLng.bind(map);

    map.layerPointToLatLng = function (layerPoint: L.Point) {
      const latLng = originalLayerPointToLatLng(layerPoint);
      const snappedPoint = onSnap(latLng, existingPolygon);
      return snappedPoint;
    };

    return () => {
      map.layerPointToLatLng = originalLayerPointToLatLng;
    };
  }, [isDrawing, onSnap, existingPolygon, map]);

  return null;
}

export default SnapDrawing;
