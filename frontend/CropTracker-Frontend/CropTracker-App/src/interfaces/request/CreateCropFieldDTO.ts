import type { LatLngObject } from "../LatLngObject";


export interface CreateCropFieldDTO {
    name: string,
    markerPosition: LatLngObject | null,
    polygonPoints: LatLngObject[]
    area: number
}