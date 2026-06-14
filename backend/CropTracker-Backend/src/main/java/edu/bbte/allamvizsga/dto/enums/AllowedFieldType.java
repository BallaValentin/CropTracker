package edu.bbte.allamvizsga.dto.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum AllowedFieldType {
    STRING ("string"),
    NUMBER("number"),
    STRING_ARRAY("string[]"),
    NUMBER_ARRAY("number[]"),
    STRINGNUMBER_ARRAY("stringNumber[]");

    private final String value;

    AllowedFieldType(String value) {
        this.value = value;
    }

    @JsonValue
    String getValue() {
        return value;
    }
}
