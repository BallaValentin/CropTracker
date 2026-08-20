import type { FieldDefinition } from "../helper/FieldDefinition";

export interface CreateWorkTypeDTO {
    name: string;
    fieldDefinitions: FieldDefinition[]
}