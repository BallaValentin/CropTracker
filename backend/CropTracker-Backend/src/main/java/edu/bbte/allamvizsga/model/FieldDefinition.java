package edu.bbte.allamvizsga.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Collection;

@Data
@AllArgsConstructor
public class FieldDefinition {
    private String name;
    private String type;
    private Boolean required;
    private Collection<String> options;
}
