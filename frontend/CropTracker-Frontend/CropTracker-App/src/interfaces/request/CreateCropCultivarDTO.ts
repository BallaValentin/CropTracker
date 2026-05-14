export interface CreateCropCultivarDTO {
    cultivarName: string,
    specieId: string
    daysToMaturity: number,
    droughtTolerance: number | null,
    idealPhRange: number | null
}