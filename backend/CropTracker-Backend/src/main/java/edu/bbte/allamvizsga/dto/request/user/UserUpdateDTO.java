package edu.bbte.allamvizsga.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserUpdateDTO {
    @NotBlank(message = "Username cannot be blank")
    @NotNull(message = "Username cannot be null")
    @Pattern(regexp = "^[A-Za-z][A-Za-z0-9_]{2,}$", message = "Invalid username pattern")
    private String username;
    @NotBlank(message = "Username cannot be blank")
    @NotNull(message = "Username cannot be null")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            message = "Invalid email pattern")
    private String email;
}
