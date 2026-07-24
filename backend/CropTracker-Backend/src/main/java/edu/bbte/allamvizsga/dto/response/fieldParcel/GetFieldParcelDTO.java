package edu.bbte.allamvizsga.dto.response.fieldParcel;

import edu.bbte.allamvizsga.dto.LatLngObject;
import lombok.Data;

import java.util.Collection;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Data
public class GetFieldParcelDTO {
    private UUID uid;
    private Collection<LatLngObject> polygonPoints;
    private String polygonColor;
    private UUID cropFieldId;
    private UUID cultivarId;
    private UUID specieId;
    private String cultivarName;
    private String specieName;
    private Double area;
    private String layoutType;
    private Map<String, Object> layoutParameters;
    private String createdAt;
}
