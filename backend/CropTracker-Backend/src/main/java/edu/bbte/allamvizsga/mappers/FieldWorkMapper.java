package edu.bbte.allamvizsga.mappers;

import edu.bbte.allamvizsga.dto.request.fieldWork.CreateFieldWorkDTO;
import edu.bbte.allamvizsga.dto.request.fieldWork.UpdateFieldWorkDTO;
import edu.bbte.allamvizsga.dto.response.fieldWork.GetFieldWorkDTO;
import edu.bbte.allamvizsga.dto.response.fieldWork.GetPreviousWorkDTO;
import edu.bbte.allamvizsga.model.FieldWork;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.time.Instant;
import java.util.UUID;

@Mapper(componentModel = "spring")
public abstract class FieldWorkMapper {
    @Mapping(target = "endDate", ignore = true)
    public abstract FieldWork createFieldWorkToModel(CreateFieldWorkDTO createFieldWorkDTO);

    @AfterMapping
    protected void afterCreateToModel(CreateFieldWorkDTO createFieldWorkDTO, @MappingTarget FieldWork fieldWork) {
        fieldWork.setFieldParcelIds(createFieldWorkDTO.getFieldParcelIds().stream().map(UUID::fromString).toList());

        fieldWork.setStartDate(Instant.parse(createFieldWorkDTO.getStartDate()));

        if (!createFieldWorkDTO.getEndDate().isBlank()) {
            fieldWork.setEndDate(Instant.parse(createFieldWorkDTO.getEndDate()));
        }
    }

    @Mapping(target = "endDate", ignore = true)
    public abstract FieldWork updateFieldWorkToModel(UpdateFieldWorkDTO updateFieldWorkDTO);

    @AfterMapping
    protected void afterUpdateToModel(UpdateFieldWorkDTO updateFieldWorkDTO, @MappingTarget FieldWork fieldWork) {
        fieldWork.setFieldParcelIds(updateFieldWorkDTO.getFieldParcelIds().stream().map(UUID::fromString).toList());

        fieldWork.setStartDate(Instant.parse(updateFieldWorkDTO.getStartDate()));

        if (!updateFieldWorkDTO.getEndDate().isBlank()) {
            fieldWork.setEndDate(Instant.parse(updateFieldWorkDTO.getEndDate()));
        }
    }

    @Mapping(target = "endDate", ignore = true)
    public abstract GetFieldWorkDTO modelToGetFieldWork(FieldWork fieldWork);

    @AfterMapping
    protected void afterModelToGet(FieldWork fieldWork, @MappingTarget GetFieldWorkDTO getFieldWorkDTO) {
        getFieldWorkDTO.setCropFieldId(fieldWork.getCropField().getUid());
        getFieldWorkDTO.setWorkTypeId(fieldWork.getWorkType().getUid());
        getFieldWorkDTO.setWorkTypeName(fieldWork.getWorkType().getName());

        getFieldWorkDTO.setStartDate(fieldWork.getStartDate().toString());
        if (fieldWork.getEndDate() == null) {
            getFieldWorkDTO.setEndDate("");
        } else {
            getFieldWorkDTO.setEndDate(fieldWork.getEndDate().toString());
        }
    }

    @Mapping(target = "endDate", ignore = true)
    public abstract GetPreviousWorkDTO modelToGetPreviousWork(FieldWork fieldWork);

    @AfterMapping
    protected void afterModelToGetPrevious(FieldWork fieldWork, @MappingTarget GetPreviousWorkDTO getPreviousWorkDTO) {
        getPreviousWorkDTO.setWorkTypeName(fieldWork.getWorkType().getName());
        getPreviousWorkDTO.setCropFieldName(fieldWork.getCropField().getName());

        getPreviousWorkDTO.setStartDate(fieldWork.getStartDate().toString());
        if (fieldWork.getEndDate() == null) {
            getPreviousWorkDTO.setEndDate("");
        } else {
            getPreviousWorkDTO.setEndDate(fieldWork.getEndDate().toString());
        }
    }
}
