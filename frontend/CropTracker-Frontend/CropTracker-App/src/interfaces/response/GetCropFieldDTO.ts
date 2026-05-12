import type { LatLngObject } from "../LatLngObject";
import type {GetFieldParcelDTO } from "./GetFieldParcelDTO";

export interface GetCropFieldDTO {
    uid: string,
    name: string,
    markerPosition: LatLngObject | null,
    polygonPoints: LatLngObject[],
    area: number,
    fieldParcels: GetFieldParcelDTO[]
}