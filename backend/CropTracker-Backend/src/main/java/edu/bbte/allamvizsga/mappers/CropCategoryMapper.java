package edu.bbte.allamvizsga.mappers;

import edu.bbte.allamvizsga.dto.response.cropCategory.GetCropCategoryDTO;
import edu.bbte.allamvizsga.model.CropCategory;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CropCategoryMapper {
    GetCropCategoryDTO modelToGetCropCategoryDTO(CropCategory cropCategory);
}
