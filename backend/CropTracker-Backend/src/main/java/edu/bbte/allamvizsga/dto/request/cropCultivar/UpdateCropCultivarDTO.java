package edu.bbte.allamvizsga.dto.request.cropCultivar;

import edu.bbte.allamvizsga.dto.customValidations.ValidName;
import lombok.Data;
import org.hibernate.validator.constraints.Range;

import java.util.UUID;

@Data
public class UpdateCropCultivarDTO {
    @ValidName(
            message = "Cultivar name can only contain letters, digits, _, - characters, " +
                    "must have a length between 4 and 35, must start with a letter " +
                    "and cannot end with a special character"
    )
    private String cultivarName;

    private UUID specieId;

    private Integer daysToMaturity;

    @Range(min = 1, max = 10, message = "Invalid drought tolerance range")
    private Integer droughtTolerance;

    @Range(min = 4, max = 9, message = "Invalid ideal ph range")
    private Double idealPhRange;
}
