import type { LatLngObject } from "../LatLngObject";
import type { LayoutParameters } from "../LayoutParameters";

export interface GetFieldParcelDTO {
    uid: string,
    polygonPoints: LatLngObject[],
    area: number,
    cropFieldId: string,
    cultivarId: string,
    polygonColor: string,
    layoutType: string,
    layoutParameters: LayoutParameters
}