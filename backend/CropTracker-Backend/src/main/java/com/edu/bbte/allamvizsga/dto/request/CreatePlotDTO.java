package com.edu.bbte.allamvizsga.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreatePlotDTO {
    @NotNull(message = "Plot name cannot be null")
    @NotBlank(message = "Plot name cannot be blank")
    private String name;
    @NotNull(message = "Plot latitude cannot be null")
    private BigDecimal latitude;
    @NotNull(message = "Plot longitude cannot be null")
    private BigDecimal longitude;
}
