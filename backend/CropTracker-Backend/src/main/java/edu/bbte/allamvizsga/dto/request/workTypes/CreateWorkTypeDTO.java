package edu.bbte.allamvizsga.dto.request.workTypes;

import edu.bbte.allamvizsga.model.FieldDefinition;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Collection;

@Data
public class CreateWorkTypeDTO {
    @NotBlank(message = "Work type name cannot be null")
    private String name;

    @NotNull(message = "Work type field definition cannot be null")
    private Collection<FieldDefinition> fieldDefinitions;
}
