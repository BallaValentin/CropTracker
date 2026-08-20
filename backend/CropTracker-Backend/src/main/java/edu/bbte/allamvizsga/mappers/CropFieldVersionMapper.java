package edu.bbte.allamvizsga.mappers;

import edu.bbte.allamvizsga.dto.LatLngObject;
import edu.bbte.allamvizsga.dto.request.cropfield.CreateCropFieldDTO;
import edu.bbte.allamvizsga.dto.request.cropfield.UpdateCropFieldDTO;
import edu.bbte.allamvizsga.dto.response.cropfield.GetCropFieldDTO;
import edu.bbte.allamvizsga.dto.response.cropfield.GetCropFieldWorkDTO;
import edu.bbte.allamvizsga.mappers.util.PolygonMapper;
import edu.bbte.allamvizsga.model.CropField;
import edu.bbte.allamvizsga.model.CropFieldVersion;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", uses = {PolygonMapper.class})
public abstract class CropFieldVersionMapper {
    @Autowired
    protected PolygonMapper polygonMapper;

    @Mapping(target = "polygonPoints", source = "polygonPoints", qualifiedByName = "toPolygon")
    public abstract CropFieldVersion createCropFieldToModel(CreateCropFieldDTO createCropFieldDTO);

    @AfterMapping
    protected void afterCreateCropFieldToModel(CreateCropFieldDTO createCropFieldDTO,
                                               @MappingTarget CropFieldVersion cropFieldVersion) {
        if (createCropFieldDTO.getMarkerPosition() != null) {
            cropFieldVersion.setLatitude(createCropFieldDTO.getMarkerPosition().getLat());
            cropFieldVersion.setLongitude(createCropFieldDTO.getMarkerPosition().getLng());
        }
    }

    @Mapping(target = "polygonPoints", source = "polygonPoints", qualifiedByName = "toPolygon")
    public abstract CropFieldVersion updateCropFieldToModel(UpdateCropFieldDTO updateCropFieldDT);

    @AfterMapping
    protected void afterUpdateCropFieldToModel(UpdateCropFieldDTO updateCropFieldDTO,
                                               @MappingTarget CropFieldVersion cropFieldVersion) {
        cropFieldVersion.setLatitude(updateCropFieldDTO.getMarkerPosition().getLat());
        cropFieldVersion.setLongitude(updateCropFieldDTO.getMarkerPosition().getLng());
    }

    @Mapping(target = "polygonPoints", source = "polygonPoints", qualifiedByName = "fromPolygon")
    public abstract GetCropFieldDTO modelToGetCropField(CropFieldVersion cropFieldVersion);

    @AfterMapping
    protected void afterModelToGetCropField(CropFieldVersion cropFieldVersion, @MappingTarget GetCropFieldDTO getCropFieldDTO) {
        getCropFieldDTO.setName(cropFieldVersion.getCropField().getName());
        getCropFieldDTO.setUid(cropFieldVersion.getCropField().getUid());
        getCropFieldDTO.setMarkerPosition(new LatLngObject(cropFieldVersion.getLatitude(), cropFieldVersion.getLongitude()));
    }

    @Mapping(target = "polygonPoints", source = "polygonPoints", qualifiedByName = "fromPolygon")
    public abstract GetCropFieldWorkDTO modelToGetCropFieldWork(CropFieldVersion cropFieldVersion);

    @AfterMapping
    protected void afterModelToGetCropFieldWork(CropFieldVersion cropFieldVersion, @MappingTarget GetCropFieldWorkDTO getCropFieldWorkDTO) {
        getCropFieldWorkDTO.setName(cropFieldVersion.getCropField().getName());
        getCropFieldWorkDTO.setCropFieldId(cropFieldVersion.getCropField().getUid());
        getCropFieldWorkDTO.setMarkerPosition(new LatLngObject(cropFieldVersion.getLatitude(), cropFieldVersion.getLongitude()));
    }
}
