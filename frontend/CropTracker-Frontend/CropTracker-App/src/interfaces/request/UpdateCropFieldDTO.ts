import type { LatLngObject } from "../LatLngObject";

export interface UpdateCropFieldDTO {
    name: string,
    markerPosition: LatLngObject | null,
    polygonPoints: LatLngObject[],
    area: number
}