package edu.bbte.allamvizsga.model;

import edu.bbte.allamvizsga.dto.customValidations.ValidName;
import edu.bbte.allamvizsga.dto.enums.FieldType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Collection;

@Data
@AllArgsConstructor
public class FieldDefinition {
    private String name;

    private FieldType type;

    private Boolean required;

    private Collection<String> options;
}
