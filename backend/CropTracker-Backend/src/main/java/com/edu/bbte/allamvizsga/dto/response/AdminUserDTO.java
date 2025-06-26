package com.edu.bbte.allamvizsga.dto.response;

import lombok.Data;

@Data
public class AdminUserDTO {
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
}
