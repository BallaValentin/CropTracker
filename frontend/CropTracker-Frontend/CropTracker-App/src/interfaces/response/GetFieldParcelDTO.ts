import type { LatLngObject } from "../LatLngObject";

export interface GetFieldParcelDTO {
    uid: string,
    polygonPoints: LatLngObject[],
    area: number,
    cropFieldId: string,
    cultivarId: string
    polygonColor: string
}