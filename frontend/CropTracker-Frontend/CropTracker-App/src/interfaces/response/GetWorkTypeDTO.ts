import type { FieldDefinition } from "../FieldDefinition";

export interface GetWorkTypeDTO {
    uid: string;
    name: string;
    fieldDefinitions: FieldDefinition[]
}