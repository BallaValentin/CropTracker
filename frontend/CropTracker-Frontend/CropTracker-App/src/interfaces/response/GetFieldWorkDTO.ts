import type { NumberWithOption } from "../helper/NumberWithOption";
import type { StringNumber } from "../helper/StringNumber";

export interface GetFieldWorkDTO {
    uid: string;
    cropFieldId: string;
    workTypeId: string;
    workTypeName: string;
    workTiming: string;
    startDate: string;
    endDate: string;
    parameters: Record<string, string | NumberWithOption | string[] | number[] | StringNumber[]>;
    affectedRows: boolean[];
    fieldParcelIds: string[];
}