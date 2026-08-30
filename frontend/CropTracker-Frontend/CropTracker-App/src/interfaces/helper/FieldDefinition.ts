export interface Option {
    optionName: string,
    conversionRate: number
}

export interface FieldDefinition {
    name: string;
    type: string;
    required: boolean;
    hasOptions: boolean;
    options: Option[]
}