package edu.bbte.allamvizsga.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AvatarUpdatesDTO {
    @NotNull(message = "New image src cannot be null")
    @NotBlank(message = "New image src cannot be blank")
    private String newAvatarSrc;
}
