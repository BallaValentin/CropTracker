package edu.bbte.allamvizsga.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.UUID;

@Data
public class ChangePasswordDTO {
    @NotNull(message = "The first password cannot be null")
    @NotBlank(message = "The first password cannot be blank")
    @Size(min = 8, max = 30, message = "Password must be between 8 and 30 characters long")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).{8,}$",
            message = "Invalid password pattern")
    private String password1;

    @NotNull(message = "The second password cannot be null")
    @NotBlank(message = "The second password cannot be blank")
    @Size(min = 8, max = 30, message = "Password must be between 8 and 30 characters long")
    private String password2;

    private UUID token;
}
