package com.edu.bbte.allamvizsga.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class GetPlotDTO {
    private UUID uid;
    private String name;
    private BigDecimal latitude;
    private BigDecimal longitude;
}
