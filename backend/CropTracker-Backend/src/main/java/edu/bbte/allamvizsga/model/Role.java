package edu.bbte.allamvizsga.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "role")
@Data
public class Role extends BaseEntity {
    @Column(unique = true, nullable = false)
    private String name;

    public Role(String name) {
        this.name = name;
    }

    public Role() {

    }
}
