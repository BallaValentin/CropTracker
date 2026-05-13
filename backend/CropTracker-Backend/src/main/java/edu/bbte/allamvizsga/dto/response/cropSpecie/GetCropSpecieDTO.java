package edu.bbte.allamvizsga.dto.response.cropSpecie;

import lombok.Data;

import java.util.UUID;

@Data
public class GetCropSpecieDTO {
    private UUID uid;
    private String commonName;
    private String scientificName;
    private UUID categoryId;
}
