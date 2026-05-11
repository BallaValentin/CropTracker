package edu.bbte.allamvizsga.dto.request.cropCultivar;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Range;

@Data
public class CreateCropCultivarDTO {
    @NotNull(message = "Cultivar name cannot be null")
    @NotBlank(message = "Cultivar name cannot be blank")
    private String cultivarName;
    @NotNull(message = "Cultivar specie name cannot be null")
    @NotBlank(message = "Cultivar specie name cannot be blank")
    private String specieName;
    private Integer daysToMaturity;
    @Range(min = 1, max = 10, message = "Invalid drought tolerance range")
    private Integer droughtTolerance;
    private Double idealPhRange;
}
