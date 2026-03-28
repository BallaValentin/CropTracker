package edu.bbte.allamvizsga.dto.response;

import edu.bbte.allamvizsga.dto.LatLngObject;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.UUID;

@Data
public class GetPlotDTO {
    private UUID uid;
    private String name;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Collection<LatLngObject> polygonPoints;
}
