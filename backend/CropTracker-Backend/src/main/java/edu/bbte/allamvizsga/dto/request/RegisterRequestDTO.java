package edu.bbte.allamvizsga.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequestDTO {
    @NotNull(message = "Username cannot be null")
    @NotBlank(message = "Username cannot be blank")
    @Pattern(regexp = "^[A-Za-z][A-Za-z0-9_]{2,}$", message = "Invalid username pattern")
    private String username;

    @NotNull(message = "The password cannot be null")
    @NotBlank(message = "The password cannot be blank")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).{8,}$",
            message = "Invalid password pattern")
    private String password;

    private String password2;

    @NotNull(message = "First name cannot be null")
    @NotBlank(message = "First name cannot be null")
    @Pattern(regexp = "^[A-Z][a-z]+$", message = "Invalid first name pattern")
    private String firstName;

    @NotNull(message = "Last name cannot be null")
    @NotBlank(message = "Last name cannot be null")
    @Pattern(regexp = "^[A-Z][a-z]+$", message = "Invalid last name pattern")
    private String lastName;

    @NotNull(message = "Email cannot be null")
    @NotBlank(message = "Email cannot be blank")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            message = "Invalid email pattern")
    private String email;

    private Boolean isGrower;
    private Boolean isWorker;
}
