import type { LatLngObject } from "../LatLngObject";

export interface GetFieldParcelDTO {
    uid: string,
    polygonPoints: LatLngObject[],
    polygonColor: string
}