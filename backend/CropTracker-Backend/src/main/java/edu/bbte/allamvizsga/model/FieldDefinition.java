package edu.bbte.allamvizsga.model;

import edu.bbte.allamvizsga.dto.enums.FieldType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Collection;

@Data
@AllArgsConstructor
public class FieldDefinition {
    private String name;

    private FieldType type;

    private Boolean required;

    private Boolean hasOptions;

    private Collection<OptionType> options;
}
