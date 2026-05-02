import type { LatLngObject } from "../LatLngObject";

export interface UpdatePlot {
    name: string,
    markerPosition: LatLngObject,
    polygonPoints: LatLngObject[],
    area: number
}