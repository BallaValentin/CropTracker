package edu.bbte.allamvizsga.dto.request;

import edu.bbte.allamvizsga.dto.LatLngObject;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Collection;

@Data
public class UpdatePlotDTO {
    private String name;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Collection<LatLngObject> polygonPoints;
    private Double area;
}
