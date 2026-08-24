package edu.bbte.allamvizsga.dto.response.cropCultivar;

import lombok.Data;

import java.util.Map;
import java.util.UUID;

@Data
public class GetCropCultivarDTO {
    private UUID uid;
    private String cultivarName;
    private Map<String, String> specieName;
    private UUID specieId;
    private Integer daysToMaturity;
    private Integer droughtTolerance;
    private Double idealPhRange;
}
