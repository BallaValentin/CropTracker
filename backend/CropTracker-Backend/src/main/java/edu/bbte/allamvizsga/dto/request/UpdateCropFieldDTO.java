package edu.bbte.allamvizsga.dto.request;

import edu.bbte.allamvizsga.dto.LatLngObject;
import lombok.Data;

import java.util.Collection;

@Data
public class UpdateCropFieldDTO {
    private String name;
    private LatLngObject markerPosition;
    private Collection<LatLngObject> polygonPoints;
    private Double area;
}
