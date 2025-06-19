package com.edu.bbte.allamvizsga.model;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Table(name = "user")
@Data
public class User extends BaseEntity{
    private String username;
    private String password;
    private String role;
}
