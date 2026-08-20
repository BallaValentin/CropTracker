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
    protected PolygonMapper polygonMapper;

    public abstract FieldParcel createFieldParcelToModel(CreateFieldParcelDTO createFieldParcelDTO);

    @AfterMapping
    protected void afterCreateFieldParcelToModel(CreateFieldParcelDTO createFieldParcelDTO,
                                                 @MappingTarget FieldParcel fieldParcel) {
        fieldParcel.setIsActive(Boolean.TRUE);
    }

    public abstract GetFieldParcelDTO modelToGetFieldParcel(FieldParcel fieldParcel);

    @AfterMapping
    protected void afterModelToGetFieldParcel(FieldParcel fieldParcel, @MappingTarget GetFieldParcelDTO getFieldParcelDTO) {
        getFieldParcelDTO.setCropFieldId(fieldParcel.getCropField().getUid());
    }
}
