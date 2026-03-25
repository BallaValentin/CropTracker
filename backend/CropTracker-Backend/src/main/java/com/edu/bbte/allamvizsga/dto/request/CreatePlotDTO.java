package com.edu.bbte.allamvizsga.dto.request;

import com.edu.bbte.allamvizsga.dto.LatLngObject;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Collection;

@Data
public class CreatePlotDTO {
    @NotNull(message = "Plot name cannot be null")
    @NotBlank(message = "Plot name cannot be blank")
    private String name;
    @NotNull(message = "Plot latitude cannot be null")
    private BigDecimal latitude;
    @NotNull(message = "Plot longitude cannot be null")
    private BigDecimal longitude;
    private final Collection<LatLngObject> polygonPoints;
}
