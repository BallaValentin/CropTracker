package edu.bbte.allamvizsga.dto.request;

import edu.bbte.allamvizsga.dto.LatLngObject;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Collection;

@Data
public class UpdatePlotDTO {
    private String name;
    private LatLngObject markerPosition;
    private Collection<LatLngObject> polygonPoints;
    private Double area;
}
