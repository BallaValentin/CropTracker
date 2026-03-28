package edu.bbte.allamvizsga.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VerifyEmailDTO {
    @NotBlank(message = "Email address cannot be blank")
    private String email;
}
