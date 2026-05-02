import type { LatLngObject } from "../LatLngObject";

export interface UpdatePlot {
    name: string,
    latitude: number,
    longitude: number,
    polygonPoints: LatLngObject[],
    area: number
}