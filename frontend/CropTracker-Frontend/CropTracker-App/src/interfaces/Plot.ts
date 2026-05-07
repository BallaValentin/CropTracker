import type { LatLngObject } from "./LatLngObject";

export interface Plot {
    uid: string,
    name: string,
    markerPosition: LatLngObject | null,
    polygonPoints: LatLngObject[],
    area: number
}