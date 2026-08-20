import type { StringNumber } from "../helper/StringNumber";

export interface GetWorkStatDTO {
    uid: string;
    workTypeName: string;
    workTypeId: string;
    cropFieldVersionId: string;
    cropFieldId: string;
    workTiming: string;
    startDate: string;
    endDate: string;
    parameters: Record<string, string | number | string[] | number[] | StringNumber[]>;
}