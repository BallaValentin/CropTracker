package edu.bbte.allamvizsga.dto.request.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResendVerificationCodeDTO {
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email address")
    private String email;
}
