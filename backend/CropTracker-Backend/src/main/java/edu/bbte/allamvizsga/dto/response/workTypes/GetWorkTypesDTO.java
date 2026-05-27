package edu.bbte.allamvizsga.dto.response.workTypes;

import edu.bbte.allamvizsga.model.FieldDefinition;
import lombok.Data;

import java.util.Collection;

@Data
public class GetWorkTypesDTO {
    private String name;
    private Collection<FieldDefinition> fieldDefinitions;
}
