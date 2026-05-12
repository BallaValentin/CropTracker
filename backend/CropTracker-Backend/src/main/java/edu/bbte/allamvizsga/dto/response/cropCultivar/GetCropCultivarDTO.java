package edu.bbte.allamvizsga.dto.response.cropCultivar;

import lombok.Data;

import java.util.UUID;

@Data
public class GetCropCultivarDTO {
    private UUID uid;
    private String cultivarName;
    private String specieName;
    private Integer daysToMaturity;
    private Integer droughtTolerance;
    private Double idealPhRange;
}
