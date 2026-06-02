import type { StringNumber } from "../StringNumber";

export interface GetFieldWorkDTO {
    uid: string;
    cropFieldId: string;
    workTypeId: string;
    workTypeName: string;
    workTiming: string;
    startDate: string;
    endDate: string;
    parameters: Map<string, string | number | string[] | number[] | StringNumber[]>;
    affectedRows: boolean[];
    fieldParcelIds: string[];
}