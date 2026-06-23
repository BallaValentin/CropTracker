export interface GetPreviousWorkDTO {
    uid: string;
    cropFieldName: string;
    workTypeName: string
    workTiming: string
    startDate: string,
    endDate: string,
    affectedRows: boolean[]
}