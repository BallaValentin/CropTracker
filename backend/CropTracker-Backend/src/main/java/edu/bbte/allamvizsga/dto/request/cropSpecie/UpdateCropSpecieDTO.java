package edu.bbte.allamvizsga.dto.request.cropSpecie;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateCropSpecieDTO {
    @NotNull(message = "Specie name cannot be null")
    @NotBlank(message = "Specie name cannot be blank")
    private String commonName;
    @NotNull(message = "Specie type name cannot be null")
    @NotBlank(message = "Specie type name cannot be blank")
    private String specieTypeName;
    private String scientificName;
}
