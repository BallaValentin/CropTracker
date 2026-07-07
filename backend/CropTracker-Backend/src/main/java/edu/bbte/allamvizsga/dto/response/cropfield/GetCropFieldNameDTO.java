package edu.bbte.allamvizsga.dto.response.cropfield;

import lombok.Data;

import java.util.UUID;

@Data
public class GetCropFieldNameDTO {
    private UUID uid;
    private String name;
}
