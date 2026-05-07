import type { LatLngObject } from "../LatLngObject";

export interface UpdateCropFieldData {
    name: string,
    markerPosition: LatLngObject | null,
    polygonPoints: LatLngObject[],
    area: number
}