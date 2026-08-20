import type { FieldDefinition } from "../helper/FieldDefinition";

export interface GetWorkTypeDTO {
    uid: string;
    name: string;
    fieldDefinitions: FieldDefinition[]
}