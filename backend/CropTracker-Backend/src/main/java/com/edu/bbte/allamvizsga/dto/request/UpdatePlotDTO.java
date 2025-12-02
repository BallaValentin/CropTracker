package com.edu.bbte.allamvizsga.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdatePlotDTO {
    private String name;
    private BigDecimal latitude;
    private BigDecimal longitude;
}
