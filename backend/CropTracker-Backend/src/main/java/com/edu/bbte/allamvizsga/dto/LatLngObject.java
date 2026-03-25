package com.edu.bbte.allamvizsga.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class LatLngObject {
    private final BigDecimal lat;
    private final BigDecimal lng;
}
