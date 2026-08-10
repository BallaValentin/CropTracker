import type { StringNumber } from "../helper/StringNumber";

export interface GetWorkStatDTO {
    uid: string;
    workTypeId: string;
    cropFieldId: string;
    workTiming: string;
    startDate: string;
    endDate: string;
    parameters: Record<string, string | number | string[] | number[] | StringNumber[]>;
}