export interface GetCropCultivarDTO {
    uid: string,
    cultivarName: string,
    specieName: Record<string, string>,
    specieId: string,
    daysToMaturity: number,
    droughtTolerance: number,
    idealPhRange: number
}