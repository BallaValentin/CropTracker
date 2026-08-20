package edu.bbte.allamvizsga.dto.request.workType.fieldDefinition;

import edu.bbte.allamvizsga.dto.customValidations.ValidName;
import edu.bbte.allamvizsga.dto.enums.AllowedFieldType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Collection;

@Data
public class CreateFieldDefinitionDTO {

        @ValidName(
                message = "Work type name can only contain letters, digits, _, - characters, " +
                        "must have a length between 4 and 35, must start with a letter " +
                        "and cannot end with a special character"
        )
        private String name;

        @NotNull(message = "Field type cannot be null")
        private AllowedFieldType type;

        @NotNull(message = "Field required cannot be null")
        private Boolean required;

        @NotNull(message = "Options cannot be null")
        private Collection<String> options;
}
