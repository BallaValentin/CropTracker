import L from "leaflet";

export function isPointInPolygon(point: { lat: number; lng: number }, 
    polygon: { lat: number; lng: number }[]): boolean {
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

export function calculatePolygonArea(polygon: { lat: number; lng: number }[]): number {
  if (polygon.length < 3) return 0;

  return L.GeometryUtil.geodesicArea(polygon.map(point => L.latLng(point.lat, point.lng)));
}