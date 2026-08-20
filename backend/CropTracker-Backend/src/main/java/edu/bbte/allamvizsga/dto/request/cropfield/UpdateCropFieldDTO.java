package edu.bbte.allamvizsga.dto.request.cropfield;

import edu.bbte.allamvizsga.dto.LatLngObject;
import edu.bbte.allamvizsga.dto.customValidations.ValidName;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Collection;

@Data
public class UpdateCropFieldDTO {
    @ValidName(
            message = "Crop field name can only contain letters, digits, _, - characters, " +
                    "must have a length between 4 and 35, must start with a letter " +
                    "and cannot end with a special character"
    )

    private String name;

    @NotNull(message = "Marker position cannot be null")
    private LatLngObject markerPosition;

    @NotNull(message = "Polygon points cannot be null")
    @Size(min = 3, message = "Polygon must have at least 4 points")
    private Collection<LatLngObject> polygonPoints;

    @NotNull(message = "Polygon area cannot be null")
    private Double area;
}
