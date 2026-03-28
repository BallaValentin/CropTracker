package edu.bbte.allamvizsga.dto.response;

import lombok.Data;

import java.util.Collection;

@Data
public class AdminUserDTO {
    private Integer id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private Collection<String> roles;
    private String avatarSrc;
    private Boolean isActive;
}
