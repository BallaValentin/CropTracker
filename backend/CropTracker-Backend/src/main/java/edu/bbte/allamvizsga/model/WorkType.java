package edu.bbte.allamvizsga.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Collection;

@Entity
@Table(name = "work_type")
@Data
@EqualsAndHashCode(callSuper = true)
public class WorkType extends BaseEntity {
    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Boolean isSystem;

    @JdbcTypeCode(SqlTypes.JSON)
    private Collection<FieldDefinition> fieldDefinitions;

    public WorkType() {

    }

    public WorkType(String name, Collection<FieldDefinition> fieldDefinitions) {
        this.name = name;
        this.isSystem = Boolean.TRUE;
        this.fieldDefinitions = fieldDefinitions;
    }
}
