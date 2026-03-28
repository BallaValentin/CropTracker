package edu.bbte.allamvizsga.dto.response;

import lombok.Data;

import java.util.Collection;

@Data
public class UserDataDTO {
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private Boolean isActive;
    private Collection<RoleDTO> roles;
}
