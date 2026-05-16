import type { LatLngObject } from "../LatLngObject";

export interface CreateFieldParcelDTO {
    cropName: string,
    polygonPoints: LatLngObject[],
    overlayColor: string,
}