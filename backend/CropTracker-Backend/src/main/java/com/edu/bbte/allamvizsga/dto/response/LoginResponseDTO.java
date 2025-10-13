package com.edu.bbte.allamvizsga.dto.response;

import lombok.Data;

import java.util.Collection;

@Data
public class LoginResponseDTO {
    private String username;
    private String firstName;
    private String lastName;
    private String avatar;
    private Collection<RoleDTO> roles;
    private String accessToken;
}
