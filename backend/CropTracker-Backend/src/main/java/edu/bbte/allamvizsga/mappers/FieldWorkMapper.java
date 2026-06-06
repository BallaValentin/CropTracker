package edu.bbte.allamvizsga.mappers;

import edu.bbte.allamvizsga.dto.request.fieldWork.CreateFieldWorkDTO;
import edu.bbte.allamvizsga.dto.response.fieldWork.GetFieldWorkDTO;
import edu.bbte.allamvizsga.model.FieldWork;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.time.Instant;
import java.util.UUID;

@Mapper(componentModel = "spring")
public abstract class FieldWorkMapper {
    public abstract FieldWork createFieldWorkToModel(CreateFieldWorkDTO createFieldWorkDTO);

    @AfterMapping
    protected void afterCreateToModel(CreateFieldWorkDTO createFieldWorkDTO, @MappingTarget FieldWork fieldWork) {
        fieldWork.setFieldParcelIds(createFieldWorkDTO.getFieldParcelIds().stream().map(UUID::fromString).toList());

        fieldWork.setStartDate(Instant.parse(createFieldWorkDTO.getStartDate()));

        if (createFieldWorkDTO.getEndDate() != null) {
            fieldWork.setEndDate(Instant.parse(createFieldWorkDTO.getEndDate()));
        }
    }

    public abstract GetFieldWorkDTO modelToGetFieldWork(FieldWork fieldWork);

    @AfterMapping
    protected void afterModelToGet(FieldWork fieldWork, @MappingTarget GetFieldWorkDTO getFieldWorkDTO) {
        getFieldWorkDTO.setCropFieldId(fieldWork.getCropField().getUid());
        getFieldWorkDTO.setWorkTypeId(fieldWork.getWorkType().getUid());
        getFieldWorkDTO.setWorkTypeName(fieldWork.getWorkType().getName());

        getFieldWorkDTO.setStartDate(fieldWork.getStartDate().toString());
        getFieldWorkDTO.setEndDate(fieldWork.getEndDate().toString());
    }
}
