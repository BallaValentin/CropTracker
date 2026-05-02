import type { LatLngObject } from "./LatLngObject";

export interface Plot {
    uid: string,
    name: string,
    markerPosition: LatLngObject,
    polygonPoints: LatLngObject[],
    area: number
}