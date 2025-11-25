package com.edu.bbte.allamvizsga.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class GetPlotDTO {
    private String name;
    private BigDecimal latitude;
    private BigDecimal longitude;
}
