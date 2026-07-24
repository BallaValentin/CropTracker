package edu.bbte.allamvizsga.dto.response.cropCultivar;

import lombok.Data;

import java.util.UUID;

@Data
public class GetSimpleCropCultivarDTO {
    private UUID uid;
    private UUID specieId;
    private String cultivarName;
    private String specieName;
}
