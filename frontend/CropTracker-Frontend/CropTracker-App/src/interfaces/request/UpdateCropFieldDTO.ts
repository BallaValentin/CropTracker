import type { LatLngObject } from "../helper/LatLngObject";

export interface UpdateCropFieldDTO {
    name: string,
    markerPosition: LatLngObject | null,
    polygonPoints: LatLngObject[],
    area: number
}