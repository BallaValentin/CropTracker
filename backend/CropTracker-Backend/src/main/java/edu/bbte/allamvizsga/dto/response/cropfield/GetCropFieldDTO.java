package edu.bbte.allamvizsga.dto.response.cropfield;

import edu.bbte.allamvizsga.dto.LatLngObject;
import edu.bbte.allamvizsga.dto.response.fieldParcel.GetFieldParcelDTO;
import lombok.Data;

import java.util.Collection;
import java.util.UUID;

@Data
public class GetCropFieldDTO {
    private UUID uid;
    private String name;
    private LatLngObject markerPosition;
    private Collection<LatLngObject> polygonPoints;
    private Double area;
    private Collection<GetFieldParcelDTO> fieldParcelDTOS;
}
