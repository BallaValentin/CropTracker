import type { LatLngObject } from "../LatLngObject";
import type { GetFieldParcelData } from "./GetFieldParcelData";

export interface GetCropFieldData {
    uid: string,
    name: string,
    markerPosition: LatLngObject | null,
    polygonPoints: LatLngObject[],
    area: number,
    fieldParcels: GetFieldParcelData[]
}