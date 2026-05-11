package edu.bbte.allamvizsga.dto.response.cropCultivar;

import lombok.Data;

@Data
public class GetCropCultivarDTO {
    private String cultivarName;
    private Integer daysToMaturity;
    private Integer droughtTolerance;
    private Double idealPhRange;
}
