package edu.bbte.allamvizsga.dto.request.cropfield;

import edu.bbte.allamvizsga.dto.LatLngObject;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.Collection;

@Data
public class CreateCropFieldDTO {
    @NotNull(message = "Crop field name cannot be null")
    @NotBlank(message = "Crop field name cannot be blank")
    @Pattern(regexp = "^[a-zA-Z0-9_ -]+$", message = "Invalid name pattern")
    private String name;
    private LatLngObject markerPosition;
    @NotNull(message = "Polygon cannot be null")
    private Collection<LatLngObject> polygonPoints;
    @NotNull(message = "Polygon area cannot be null")
    private Double area;
}
