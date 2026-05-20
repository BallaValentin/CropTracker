import type { LatLngObject } from "../LatLngObject";

export interface UpdateFieldParcelDTO {
    polygonPoints: LatLngObject[];
        cropFieldId: string;
        cropCultivarId: string;
        area: number;
        polygonColor: string;
}