import type { FieldDefinition } from "../FieldDefinition";

export interface CreateWorkTypeDTO {
    name: string;
    fieldDefinitions: FieldDefinition[]
}