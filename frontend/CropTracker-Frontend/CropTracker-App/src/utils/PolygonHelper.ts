import L from "leaflet";
import type { LatLngObject } from "../interfaces/helper/LatLngObject";

export function isPointInPolygon(point: LatLngObject, 
    polygon: LatLngObject[]): boolean {
  let isInside = false;
  const { lat, lng } = point;
  const n = polygon.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const { lat: lat1, lng: lng1 } = polygon[i];
    const { lat: lat2, lng: lng2 } = polygon[j];
    if (((lng1 > lng) !== (lng2 > lng)) && (lat < ((lat2 - lat1) * (lng - lng1)) / (lng2 - lng1) + lat1)) {
      isInside = !isInside;
    }
  }
  return isInside;
}

export function getPolygonCenter(polygon: LatLngObject[]) : LatLngObject {
  const centerPoint: LatLngObject = {
    lat: 0,
    lng: 0
  }

  polygon.forEach(point => {
    centerPoint.lat += point.lat;
    centerPoint.lng += point.lng;
  })

  centerPoint.lat /= polygon.length;
  centerPoint.lng /= polygon.length;

  return centerPoint;
}

export function calculatePolygonArea(polygon: LatLngObject[]): number {
  if (polygon.length < 3) return 0;

  return L.GeometryUtil.geodesicArea(polygon.map(point => L.latLng(point.lat, point.lng)));
}