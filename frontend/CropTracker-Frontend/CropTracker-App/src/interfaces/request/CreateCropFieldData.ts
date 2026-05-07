import type { LatLngObject } from "../LatLngObject";


export interface CreateCropFieldData {
    name: string,
    markerPosition: LatLngObject | null,
    polygonPoints: LatLngObject[]
    area: number
}