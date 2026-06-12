import type { LatLngObject } from "./LatLngObject"

export interface LayoutParameters {
    referenceRow: LatLngObject[]
    bedSpacing: number,
    plantSpacing: number,
    rowSpacing: number,
    marginSpacing: number,
    numberOfRows: number,
    rowWidth: number,
    linesPerRow: number
}