package edu.bbte.allamvizsga.dto.request.workType;

import edu.bbte.allamvizsga.dto.customValidations.ValidName;
import edu.bbte.allamvizsga.dto.request.workType.fieldDefinition.CreateFieldDefinitionDTO;
import edu.bbte.allamvizsga.model.FieldDefinition;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.Collection;

@Data
public class CreateWorkTypeDTO {
    @NotBlank(message = "Work type name cannot be null")
    @ValidName(
            message = "Work type name can only contain letters, digits, _, - characters, " +
                    "must have a length between 4 and 35, must start with a letter " +
                    "and cannot end with a special character"
    )
    private String name;

    @NotNull(message = "Work type field definition cannot be null")
    @Valid
    private Collection<CreateFieldDefinitionDTO> fieldDefinitions;
}
