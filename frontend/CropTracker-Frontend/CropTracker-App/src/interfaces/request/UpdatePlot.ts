import type { LatLngObject } from "../LatLngObject";

export interface UpdatePlot {
    name: string,
    markerPosition: LatLngObject | null,
    polygonPoints: LatLngObject[],
    area: number
}