import type { LatLngObject } from "./LatLngObject";

export interface Plot {
    uid: string,
    name: string,
    latitude: number,
    longitude: number,
    polygonPoints: LatLngObject[],
    area: number
}