import type { LatLngObject } from "../helper/LatLngObject";
import type { LayoutParameters } from "../helper/LayoutParameters";

export interface GetFieldParcelDTO {
    uid: string,
    polygonPoints: LatLngObject[],
    area: number,
    cropFieldId: string,
    cultivarId: string,
    specieId: string,
    polygonColor: string,
    layoutType: string,
    layoutParameters: LayoutParameters,
    specieName: Record<string, string>,
    cultivarName: string,
    createdAt: string
}