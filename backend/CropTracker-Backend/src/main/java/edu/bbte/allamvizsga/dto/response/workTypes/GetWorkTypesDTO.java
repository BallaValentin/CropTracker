package edu.bbte.allamvizsga.dto.response.workTypes;

import edu.bbte.allamvizsga.model.FieldDefinition;
import lombok.Data;

import java.util.Collection;
import java.util.UUID;

@Data
public class GetWorkTypesDTO {
    private UUID uid;
    private String name;
    private Boolean isSystem;
    private Collection<FieldDefinition> fieldDefinitions;
}
