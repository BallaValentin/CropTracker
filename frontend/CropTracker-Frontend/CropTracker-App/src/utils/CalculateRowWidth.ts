import type { LayoutParameters } from "../interfaces/LayoutParameters";
import { cropWidthCm } from "./Constants";
import { LayoutTypes } from "./LayoutTypes";

export const calculateRowWidth = (layoutParameters: LayoutParameters, layoutType: string) => {
    if (layoutType === LayoutTypes.SingleRow) {
        return cropWidthCm + layoutParameters.marginSpacing * 2;
    } else {
        return cropWidthCm + layoutParameters.marginSpacing * 2 + layoutParameters.rowSpacing;
    }
}