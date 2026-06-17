import type { StringNumber } from "../helper/StringNumber";

export interface CreateFieldWorkDTO {
  cropFieldId: string;
  fieldParcelIds: string[];
  workTypeId: string;
  startDate: string;
  endDate: string;
  workTiming: string;
  parameters: Record<string, string | number | string[] | number[] | StringNumber[]>;
  affectedRows: boolean[];
}