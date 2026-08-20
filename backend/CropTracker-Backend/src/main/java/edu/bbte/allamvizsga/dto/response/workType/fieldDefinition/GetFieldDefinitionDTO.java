package edu.bbte.allamvizsga.dto.response.workType.fieldDefinition;

import edu.bbte.allamvizsga.dto.enums.FieldType;
import lombok.Data;

import java.util.Collection;

@Data
public class GetFieldDefinitionDTO {
    private String name;

    private FieldType type;

    private Boolean required;

    private Collection<String> options;
}
