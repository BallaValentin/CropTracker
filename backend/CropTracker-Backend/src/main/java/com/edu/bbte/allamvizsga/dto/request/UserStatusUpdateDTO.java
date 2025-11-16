package com.edu.bbte.allamvizsga.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserStatusUpdateDTO {
    @NotNull(message = "Username cannot be null")
    @NotBlank(message = "Username cannot be blank")
    private String username;

    @NotNull(message = "Status cannot be null")
    @NotBlank(message = "Status cannot be blank")
    @Pattern(regexp = "ACTIVE|SUSPENDED", message = "Invalid user status")
    private String status;
}
