package com.edu.bbte.allamvizsga.dto.response;

import lombok.Data;

import java.util.Collection;

@Data
public class UserDataDTO {
    private String username;
    private String firstName;
    private String lastName;
    private Collection<RoleDTO> roles;
}
