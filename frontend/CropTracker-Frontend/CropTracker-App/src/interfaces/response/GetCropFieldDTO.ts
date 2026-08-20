import type { LatLngObject } from "../helper/LatLngObject";

export interface GetCropFieldDTO {
    uid: string,
    cropFieldId: string,
    name: string,
    markerPosition: LatLngObject | null,
    polygonPoints: LatLngObject[],
    area: number
}