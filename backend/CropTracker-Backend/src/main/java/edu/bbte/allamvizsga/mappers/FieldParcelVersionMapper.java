package edu.bbte.allamvizsga.mappers;

import edu.bbte.allamvizsga.dto.request.fieldParcel.CreateFieldParcelDTO;
import edu.bbte.allamvizsga.dto.request.fieldParcel.UpdateFieldParcelDTO;
import edu.bbte.allamvizsga.dto.response.fieldParcel.GetFieldParcelDTO;
import edu.bbte.allamvizsga.mappers.util.PolygonMapper;
import edu.bbte.allamvizsga.model.FieldParcel;
import edu.bbte.allamvizsga.model.FieldParcelVersion;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", uses = {PolygonMapper.class})
public abstract class FieldParcelVersionMapper {
    @Autowired
    protected PolygonMapper polygonMapper;

    @Mapping(target = "polygonPoints", source = "polygonPoints", qualifiedByName = "toPolygon")
    public abstract FieldParcelVersion createFieldParcelToModel(CreateFieldParcelDTO createFieldParcelDTO);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "polygonPoints", ignore = true)
    public abstract FieldParcelVersion updateFieldParcelDTOtoModel(UpdateFieldParcelDTO updateCropFieldDTO);

    @AfterMapping
    protected void afterUpdateDTOtoModel(UpdateFieldParcelDTO updateFieldParcelDTO,
                                         @MappingTarget FieldParcelVersion fieldParcelVersion) {
        fieldParcelVersion.setPolygonPoints(polygonMapper.mapPointsToPolygon(updateFieldParcelDTO.getPolygonPoints()));
    }

    @Mapping(target = "polygonPoints", source = "polygonPoints", qualifiedByName = "fromPolygon")
    public abstract GetFieldParcelDTO modelToGetFieldParcel(FieldParcelVersion fieldParcelVersion);

    @AfterMapping
    protected void afterModelToGetFieldParcel(FieldParcelVersion fieldParcelVersion,
                                              @MappingTarget GetFieldParcelDTO getFieldParcelDTO) {
        getFieldParcelDTO.setUid(fieldParcelVersion.getFieldParcel().getUid());
        getFieldParcelDTO.setCropFieldId(fieldParcelVersion.getCropFieldVersion().getUid());
        getFieldParcelDTO.setCultivarId(fieldParcelVersion.getCropCultivar().getUid());
        getFieldParcelDTO.setCultivarName(fieldParcelVersion.getCropCultivar().getCultivarName());
        getFieldParcelDTO.setSpecieName(fieldParcelVersion.getCropCultivar().getCropSpecie().getCommonName());
        getFieldParcelDTO.setCreatedAt(fieldParcelVersion.getFieldParcel().getCreatedAt().toString());
    }
}
