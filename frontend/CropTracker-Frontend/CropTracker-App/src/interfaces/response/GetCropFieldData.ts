import type { LatLngObject } from "../LatLngObject";

export interface GetCropFieldData {
    uid: string,
    name: string,
    markerPosition: LatLngObject | null,
    polygonPoints: LatLngObject[],
    area: number
}