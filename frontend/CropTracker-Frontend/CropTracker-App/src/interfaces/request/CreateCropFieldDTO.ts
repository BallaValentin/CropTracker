import type { LatLngObject } from "../helper/LatLngObject";


export interface CreateCropFieldDTO {
    name: string,
    markerPosition: LatLngObject | null,
    polygonPoints: LatLngObject[]
    area: number
}