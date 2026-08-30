package edu.bbte.allamvizsga.dto.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum FieldType {
    STRING ("string"),
    NUMBER("number"),
    STRING_ARRAY("string[]"),
    NUMBER_ARRAY("number[]"),
    STRINGNUMBER_ARRAY("stringNumber[]"),
    SELECT("select");

    private String value;

    FieldType(String value) {
        this.value = value;
    }

    public static FieldType fromAllowedFieldType(AllowedFieldType allowedType) {
        if (allowedType == null) return null;
        return FieldType.valueOf(allowedType.name());
    }

    @JsonValue
    String getValue() {
        return value;
    }
}
