import type { NumberWithOption } from "../helper/NumberWithOption";
import type { StringNumber } from "../helper/StringNumber";

export interface UpdateFieldWorkDTO {
    cropFieldId: string;
    fieldParcelIds: string[];
    workTypeId: string;
    startDate: string;
    endDate: string;
    workTiming: string;
    parameters: Record<string, string | NumberWithOption | string[] | number[] | StringNumber[]>;
    affectedRows: boolean[];
}