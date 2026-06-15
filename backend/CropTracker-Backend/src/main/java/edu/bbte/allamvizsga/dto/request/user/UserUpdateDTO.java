package edu.bbte.allamvizsga.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateDTO {
    @NotBlank(message = "Username cannot be blank")
    @NotNull(message = "Username cannot be null")
    @Size(min = 2, max = 30, message = "Username length must be between 2 and 30")
    @Pattern(regexp = "^[A-Za-z][A-Za-z0-9_]+$", message = "Invalid username pattern")
    private String username;

    @NotNull(message = "First name cannot be null")
    @NotBlank(message = "First name cannot be blank")
    @Size(min = 2, max = 30, message = "First name must be between 2 and 30 characters long")
    @Pattern(
            regexp = "^\\p{Lu}\\p{Ll}+$",
            message = "First name must start with an uppercase letter followed only by lowercase letters"
    )
    private String firstName;

    @NotNull(message = "Last name cannot be null")
    @NotBlank(message = "Last name cannot be blank")
    @Size(min = 2, max = 30, message = "First name must be between 2 and 30 characters long")
    @Pattern(
            regexp = "^\\p{Lu}\\p{Ll}+$",
            message = "First name must start with an uppercase letter followed only by lowercase letters"
    )
    private String lastName;

    private String avatarUrl;
}
