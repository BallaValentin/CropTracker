import type { LatLngObject } from "../LatLngObject";


export interface PostPlot {
    name: string,
    latitude: number,
    longitude: number,
    polygonPoints: LatLngObject[]
}