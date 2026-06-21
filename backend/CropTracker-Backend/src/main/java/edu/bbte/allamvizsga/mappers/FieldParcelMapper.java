package edu.bbte.allamvizsga.mappers;

import edu.bbte.allamvizsga.dto.request.fieldParcel.CreateFieldParcelDTO;
import edu.bbte.allamvizsga.dto.request.fieldParcel.UpdateFieldParcelDTO;
import edu.bbte.allamvizsga.dto.response.fieldParcel.GetFieldParcelDTO;
import edu.bbte.allamvizsga.mappers.util.PolygonMapper;
import edu.bbte.allamvizsga.model.FieldParcel;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", uses = {PolygonMapper.class})
public abstract class FieldParcelMapper {
    @Autowired
    protected  PolygonMapper polygonMapper;

    @Mapping(target = "polygonPoints", source = "polygonPoints", qualifiedByName = "toPolygon")
    public abstract FieldParcel createFieldParcelDTOtoModel(CreateFieldParcelDTO createFieldParcelDTO);

    @Mapping(target = "polygonPoints", source = "polygonPoints", qualifiedByName = "fromPolygon")
    public abstract GetFieldParcelDTO modelToGetFieldParcelDTO(FieldParcel fieldParcel);

    @AfterMapping
    protected void afterModelToGetFieldParcel(FieldParcel fieldParcel, @MappingTarget GetFieldParcelDTO getFieldParcelDTO) {
        getFieldParcelDTO.setCropFieldId(fieldParcel.getCropField().getUid());
        getFieldParcelDTO.setCultivarId(fieldParcel.getCropCultivar().getUid());
        getFieldParcelDTO.setCultivarName(fieldParcel.getCropCultivar().getCultivarName());
        getFieldParcelDTO.setSpecieName(fieldParcel.getCropCultivar().getCropSpecie().getCommonName());
    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "polygonPoints", ignore = true)
    public abstract FieldParcel updateFieldParcelDTOtoModel(UpdateFieldParcelDTO updateCropFieldDTO);

    @AfterMapping
    protected void afterUpdateDTOtoModel(UpdateFieldParcelDTO updateFieldParcelDTO, @MappingTarget FieldParcel fieldParcel) {
        fieldParcel.setPolygonPoints(polygonMapper.mapPointsToPolygon(updateFieldParcelDTO.getPolygonPoints()));
    }
}
