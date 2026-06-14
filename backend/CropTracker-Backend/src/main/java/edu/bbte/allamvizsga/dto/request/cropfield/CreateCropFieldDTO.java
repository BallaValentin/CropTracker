package edu.bbte.allamvizsga.dto.request.cropfield;

import edu.bbte.allamvizsga.dto.LatLngObject;
import edu.bbte.allamvizsga.dto.customValidations.ValidName;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.Collection;

@Data
public class CreateCropFieldDTO {
    @ValidName(
            message = "Crop field name can only contain letters, digits, _, - characters, " +
                    "must have a length between 4 and 35, must start with a letter " +
                    "and cannot end with a special character"
    )
    private String name;
    private LatLngObject markerPosition;
    @NotNull(message = "Polygon cannot be null")
    private Collection<LatLngObject> polygonPoints;
    @NotNull(message = "Polygon area cannot be null")
    private Double area;
}
