package edu.bbte.allamvizsga.dto.request.cropSpecie;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateCropSpecieDTO {
    @NotNull(message = "Specie name cannot be null")
    @NotBlank(message = "Specie name cannot be blank")
    private String commonName;

    private UUID categoryId;

    @Pattern(regexp = "^(?!\\s*$).+", message = "Scientific name cannot be blank")
    private String scientificName;
}
