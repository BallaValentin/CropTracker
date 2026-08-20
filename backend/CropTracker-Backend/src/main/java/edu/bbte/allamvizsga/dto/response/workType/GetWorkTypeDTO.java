package edu.bbte.allamvizsga.dto.response.workType;

import edu.bbte.allamvizsga.model.FieldDefinition;
import lombok.Data;

import java.util.Collection;
import java.util.UUID;

@Data
public class GetWorkTypeDTO {
    private UUID uid;
    private String name;
    private Boolean isSystem;
    private Collection<FieldDefinition> fieldDefinitions;
}
