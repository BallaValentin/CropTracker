package edu.bbte.allamvizsga.dto.request.cropfield;

import edu.bbte.allamvizsga.dto.LatLngObject;
import edu.bbte.allamvizsga.dto.customValidations.ValidName;
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
    private LatLngObject markerPosition;
    private Collection<LatLngObject> polygonPoints;
    private Double area;
}
