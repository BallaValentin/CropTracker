export interface GetPreviousWorkDTO {
    uid: string;
    cropFieldName: string;
    cropFieldId: string;
    workTypeName: string
    workTypeId: string;
    workTiming: string
    startDate: string,
    endDate: string,
    affectedRows: boolean[]
}