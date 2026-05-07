import type { LatLngObject } from "../LatLngObject";


export interface PostPlot {
    name: string,
    markerPosition: LatLngObject | null,
    polygonPoints: LatLngObject[]
    area: number
}