import type { LatLngObject } from "../interfaces/LatLngObject";

export const getNameError = (value: string): string | null => {
  if (!value) return "Name is required.";
  if (value.length < 4 || value.length > 35) return "Must be between 4 and 35 characters.";
  if (!/^\p{Lu}/u.test(value)) return "Must start with an uppercase letter.";
  if (/[\s_-]$/.test(value)) return "Cannot end with a space, _ or -";
  if (!/^[\p{L}\d\s_-]+$/u.test(value)) return "Only letters, numbers, spaces, '_' and '-' are allowed.";
  
  return null;
}

export const getPolygonError = (polygonPoints: LatLngObject[]): string | null => {
    if (!polygonPoints || polygonPoints.length < 3) return "Missing polygon shape.";
    return null;
}