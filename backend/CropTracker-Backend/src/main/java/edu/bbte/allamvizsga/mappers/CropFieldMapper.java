package edu.bbte.allamvizsga.mappers;

import edu.bbte.allamvizsga.dto.LatLngObject;
import edu.bbte.allamvizsga.dto.request.cropfield.CreateCropFieldDTO;
import edu.bbte.allamvizsga.dto.request.cropfield.UpdateCropFieldDTO;
import edu.bbte.allamvizsga.dto.response.cropfield.GetCropFieldDTO;
import edu.bbte.allamvizsga.mappers.util.PolygonMapper;
import edu.bbte.allamvizsga.model.CropField;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", uses = {PolygonMapper.class})
public abstract class CropFieldMapper {
    @Autowired
    protected PolygonMapper polygonMapper;

    @Mapping(target = "polygonPoints", source = "polygonPoints", qualifiedByName = "toPolygon")
    public abstract CropField createCropFieldDTOtoModel(CreateCropFieldDTO createCropFieldDTO);

    @AfterMapping
    protected void afterCreateDTOMapping(CreateCropFieldDTO createCropFieldDTO, @MappingTarget CropField cropField) {
        if (createCropFieldDTO.getMarkerPosition() != null) {
            cropField.setLatitude(createCropFieldDTO.getMarkerPosition().getLat());
            cropField.setLongitude(createCropFieldDTO.getMarkerPosition().getLng());
        }
    }

    @Mapping(target = "polygonPoints", source = "polygonPoints", qualifiedByName = "fromPolygon")
    public abstract GetCropFieldDTO modelToGetCropFieldDTO(CropField cropField);

    @AfterMapping
    protected void afterCropFieldMapping(CropField cropField, @MappingTarget GetCropFieldDTO getCropFieldDTO) {
        if (cropField.getLatitude() != null && cropField.getLongitude() != null) {
            getCropFieldDTO.setMarkerPosition(new LatLngObject(cropField.getLatitude(), cropField.getLongitude()));
        }
    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "polygonPoints", ignore = true)
    public abstract void updateModelFromUpdateCropFieldDto(UpdateCropFieldDTO updateCropFieldDTO, @MappingTarget CropField cropField);

    @AfterMapping
    protected void afterUpdateDTOMapping(UpdateCropFieldDTO updateCropFieldDTO, @MappingTarget CropField cropField) {
        cropField.setPolygonPoints(polygonMapper.mapPointsToPolygon(updateCropFieldDTO.getPolygonPoints()));
        if (updateCropFieldDTO.getMarkerPosition() != null) {
            cropField.setLatitude(updateCropFieldDTO.getMarkerPosition().getLat());
            cropField.setLongitude(updateCropFieldDTO.getMarkerPosition().getLng());
        }
    }
}
