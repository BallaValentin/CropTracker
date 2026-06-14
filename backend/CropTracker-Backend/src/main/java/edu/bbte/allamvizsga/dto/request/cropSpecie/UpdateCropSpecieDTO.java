package edu.bbte.allamvizsga.dto.request.cropSpecie;

import edu.bbte.allamvizsga.dto.customValidations.ValidName;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.UUID;

@Data
public class UpdateCropSpecieDTO {
    @ValidName(
            message = "Specie name can only contain letters, digits, _, - characters, " +
                    "must have a length between 4 and 35, must start with a letter " +
                    "and cannot end with a special character"
    )
    private String commonName;

    private UUID categoryId;

    @Pattern(regexp = "^(?!\\s*$).+", message = "Scientific name cannot be blank")
    private String scientificName;
}
