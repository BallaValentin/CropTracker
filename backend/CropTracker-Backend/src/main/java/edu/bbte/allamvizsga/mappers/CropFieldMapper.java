package edu.bbte.allamvizsga.mappers;

import edu.bbte.allamvizsga.dto.request.cropfield.CreateCropFieldDTO;
import edu.bbte.allamvizsga.dto.response.cropfield.GetCropFieldDTO;
import edu.bbte.allamvizsga.dto.response.cropfield.GetCropFieldNameDTO;
import edu.bbte.allamvizsga.mappers.util.PolygonMapper;
import edu.bbte.allamvizsga.model.CropField;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {PolygonMapper.class})
public abstract class CropFieldMapper {

    public abstract CropField createCropFieldDTOtoModel(CreateCropFieldDTO createCropFieldDTO);

    @AfterMapping
    protected void afterCreateDTOMapping(CreateCropFieldDTO createCropFieldDTO, @MappingTarget CropField cropField) {
        cropField.setIsActive(Boolean.TRUE);
    }

    public abstract GetCropFieldDTO modelToGetCropFieldDTO(CropField cropField);

    public abstract GetCropFieldNameDTO modelToGetCropFieldName(CropField cropField);
}
