import type { LatLngObject } from "../LatLngObject";

export interface CreateFieldParcelData {
    cropName: string,
    polygonPoints: LatLngObject[]
}