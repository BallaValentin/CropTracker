import type { LatLngObject } from "../LatLngObject";


export interface PostPlot {
    name: string,
    markerPosition: LatLngObject,
    polygonPoints: LatLngObject[]
    area: number
}