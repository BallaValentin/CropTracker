import L from "leaflet";
import type { LatLngObject } from "../interfaces/LatLngObject";

export function calculateArea (points: LatLngObject[]) {
    if (points.length < 3) return 0;
    const latLngs = points.map((point) => L.latLng(point.lat, point.lng));
    const polygon = L.polygon(latLngs);
    return L.GeometryUtil.geodesicArea(polygon.getLatLngs()[0] as L.LatLng[]);
  };