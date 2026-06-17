import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { LatLngObject } from "../interfaces/helper/LatLngObject";

interface MapBoundsHelperProps {
  polygonPoints: LatLngObject[];
}

function MapBoundsHelper({ polygonPoints }: MapBoundsHelperProps) {
  const map = useMap();
  useEffect(() => {
    if (polygonPoints && polygonPoints.length > 3) {
      setTimeout(() => {
        map.invalidateSize();

        const polygon = new L.Polygon(polygonPoints);
        const bounds = polygon.getBounds();

        map.fitBounds(bounds, {
          padding: [20, 20],
        });
      }, 50);
    }
  }, [polygonPoints, map]);
  return null;
}

export default MapBoundsHelper;
