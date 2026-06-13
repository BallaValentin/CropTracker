package edu.bbte.allamvizsga.dto.request.cropCultivar;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Range;

import java.util.UUID;

@Data
public class CreateCropCultivarDTO {
    @NotNull(message = "Cultivar name cannot be null")
    @NotBlank(message = "Cultivar name cannot be blank")
    private String cultivarName;

    private UUID specieId;

    private Integer daysToMaturity;

    @Range(min = 1, max = 10, message = "Invalid drought tolerance range")
    private Integer droughtTolerance;

    @Range(min = 4, max = 9, message = "Invalid ideal ph range")
    private Double idealPhRange;
}
