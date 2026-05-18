import type { LatLngObject } from "../LatLngObject";

export interface CreateFieldParcelDTO {
    polygonPoints: LatLngObject[];
    cropFieldId: string;
    cropCultivarId: string;
    area: number;
    polygonColor: string;
}