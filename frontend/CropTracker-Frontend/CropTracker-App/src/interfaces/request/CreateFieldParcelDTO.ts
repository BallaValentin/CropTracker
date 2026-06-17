import type { LatLngObject } from "../helper/LatLngObject";
import type { LayoutParameters } from "../helper/LayoutParameters";

export interface CreateFieldParcelDTO {
    polygonPoints: LatLngObject[];
    cropFieldId: string;
    cropCultivarId: string;
    area: number;
    polygonColor: string;
    layoutType: string
    layoutParameters: LayoutParameters
}