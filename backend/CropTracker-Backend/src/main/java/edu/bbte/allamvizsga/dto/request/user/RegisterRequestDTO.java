package edu.bbte.allamvizsga.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequestDTO {
    @NotNull(message = "Username cannot be null")
    @NotBlank(message = "Username cannot be blank")
    @Size(min = 2, max = 30, message = "Username length must be between 2 and 30")
    @Pattern(regexp = "^[A-Za-z][A-Za-z0-9_]+$", message = "Invalid username pattern")
    private String username;

    @NotNull(message = "The password cannot be null")
    @NotBlank(message = "The password cannot be blank")
    @Size(min = 8, max = 30, message = "Password length must be between 2 and 30")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).{8,}$",
            message = "Invalid password pattern")
    private String password;

    @NotNull(message = "The password cannot be null")
    @NotBlank(message = "The password cannot be blank")
    @Size(min = 8, max = 30, message = "Password length must be between 8 and 30")
    private String password2;

    @NotNull(message = "First name cannot be null")
    @NotBlank(message = "First name cannot be null")
    @Size(min = 2, max = 30, message = "First name must be between 2 and 30 characters long")
    @Pattern(
            regexp = "^\\p{Lu}\\p{Ll}+$",
            message = "First name must start with an uppercase letter followed only by lowercase letters"
    )
    private String firstName;

    @NotNull(message = "Last name cannot be null")
    @NotBlank(message = "Last name cannot be null")
    @Size(min = 2, max = 30, message = "Last name must be between 2 and 30 characters long")
    @Pattern(
            regexp = "^\\p{Lu}\\p{Ll}+$",
            message = "Last name must start with an uppercase letter followed only by lowercase letters"
    )
    private String lastName;

    @NotNull(message = "Email cannot be null")
    @NotBlank(message = "Email cannot be blank")
    @Size(min = 6, max = 100, message = "Email must be between 6 and 100 characters long")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            message = "Invalid email pattern")
    private String email;

    @NotNull(message = "isGrower cannot be null")
    private Boolean isGrower;

    @NotNull(message = "isWorker cannot be null")
    private Boolean isWorker;
}
