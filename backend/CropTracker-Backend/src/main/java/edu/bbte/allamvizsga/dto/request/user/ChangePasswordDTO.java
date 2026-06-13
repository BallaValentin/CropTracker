package edu.bbte.allamvizsga.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.UUID;

@Data
public class ChangePasswordDTO {
    @NotNull(message = "The first password cannot be null")
    @NotBlank(message = "The first password cannot be blank")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).{8,}$",
            message = "Invalid password pattern")
    private String password1;

    @NotNull(message = "The second password cannot be null")
    @NotBlank(message = "The second password cannot be blank")
    private String password2;

    private UUID token;
}
