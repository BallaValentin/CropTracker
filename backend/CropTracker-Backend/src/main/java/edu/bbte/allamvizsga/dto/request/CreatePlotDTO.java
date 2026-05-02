package edu.bbte.allamvizsga.dto.request;

import edu.bbte.allamvizsga.dto.LatLngObject;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Collection;

@Data
public class CreatePlotDTO {
    @NotNull(message = "Plot name cannot be null")
    @NotBlank(message = "Plot name cannot be blank")
    @Pattern(regexp = "^[a-zA-Z0-9_ -]+$", message = "Invalid name pattern")
    private String name;
    @NotNull(message = "Plot latitude cannot be null")
    private BigDecimal latitude;
    @NotNull(message = "Plot longitude cannot be null")
    private BigDecimal longitude;
    @NotNull(message = "Polygon cannot be null")
    private Collection<LatLngObject> polygonPoints;
    @NotNull(message = "Polygon area cannot be null")
    private Double area;
}
