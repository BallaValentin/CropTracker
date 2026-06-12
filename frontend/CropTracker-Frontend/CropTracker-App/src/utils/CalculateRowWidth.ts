import type { LayoutParameters } from "../interfaces/LayoutParameters";
import { cropWidthCm } from "./Constants";
import { LayoutTypes } from "./LayoutTypes";

export const calculateRowWidth = (layoutParameters: LayoutParameters, layoutType: string, isLayoutTypeChange: boolean) => {
    if (layoutType === LayoutTypes.SingleRow) {
        return cropWidthCm + layoutParameters.marginSpacing * 2;
    } else {
        const numberOfLines = isLayoutTypeChange ? 1 : layoutParameters.linesPerRow;

        return cropWidthCm + layoutParameters.marginSpacing * 2 + 
        (layoutParameters.rowSpacing * (numberOfLines - 1));
    }
}