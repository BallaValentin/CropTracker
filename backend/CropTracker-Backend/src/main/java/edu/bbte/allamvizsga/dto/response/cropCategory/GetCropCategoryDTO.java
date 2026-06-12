package edu.bbte.allamvizsga.dto.response.cropCategory;

import lombok.Data;

import java.util.UUID;

@Data
public class GetCropCategoryDTO {
    private UUID uid;
    private String categoryName;
}
