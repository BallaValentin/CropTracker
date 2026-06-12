import type { LatLngObject } from "../LatLngObject";
import type { LayoutParameters } from "../LayoutParameters";

export interface UpdateFieldParcelDTO {
    polygonPoints: LatLngObject[];
        cropFieldId: string;
        cropCultivarId: string;
        area: number;
        polygonColor: string;
        layoutType: string;
        layoutParameters: LayoutParameters;
}