package edu.bbte.allamvizsga.mappers;

import edu.bbte.allamvizsga.dto.request.fieldWork.CreateFieldWorkDTO;
import edu.bbte.allamvizsga.dto.request.fieldWork.UpdateFieldWorkDTO;
import edu.bbte.allamvizsga.dto.response.fieldWork.GetFieldWorkDTO;
import edu.bbte.allamvizsga.dto.response.fieldWork.GetPreviousWorkDTO;
import edu.bbte.allamvizsga.dto.response.fieldWork.GetWorkStatDTO;
import edu.bbte.allamvizsga.model.FieldWork;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.time.OffsetDateTime;
import java.util.UUID;

@Mapper(componentModel = "spring")
public abstract class FieldWorkMapper {
    @Mapping(target = "startDate", ignore = true)
    @Mapping(target = "endDate", ignore = true)
    public abstract FieldWork createFieldWorkToModel(CreateFieldWorkDTO createFieldWorkDTO);

    @AfterMapping
    protected void afterCreateToModel(CreateFieldWorkDTO createFieldWorkDTO, @MappingTarget FieldWork fieldWork) {
        fieldWork.setFieldParcelIds(createFieldWorkDTO.getFieldParcelIds().stream().map(UUID::fromString).toList());

        fieldWork.setStartDate(OffsetDateTime.parse(createFieldWorkDTO.getStartDate()));

        if (!createFieldWorkDTO.getEndDate().isBlank()) {
            fieldWork.setEndDate(OffsetDateTime.parse(createFieldWorkDTO.getEndDate()));
        }
    }

    @Mapping(target = "startDate", ignore = true)
    @Mapping(target = "endDate", ignore = true)
    public abstract FieldWork updateFieldWorkToModel(UpdateFieldWorkDTO updateFieldWorkDTO);

    @AfterMapping
    protected void afterUpdateToModel(UpdateFieldWorkDTO updateFieldWorkDTO, @MappingTarget FieldWork fieldWork) {
        fieldWork.setFieldParcelIds(updateFieldWorkDTO.getFieldParcelIds().stream().map(UUID::fromString).toList());

        fieldWork.setStartDate(OffsetDateTime.parse(updateFieldWorkDTO.getStartDate()));

        if (!updateFieldWorkDTO.getEndDate().isBlank()) {
            fieldWork.setEndDate(OffsetDateTime.parse(updateFieldWorkDTO.getEndDate()));
        }
    }

    @Mapping(target = "startDate", ignore = true)
    @Mapping(target = "endDate", ignore = true)
    public abstract GetFieldWorkDTO modelToGetFieldWork(FieldWork fieldWork);

    @AfterMapping
    protected void afterModelToGet(FieldWork fieldWork, @MappingTarget GetFieldWorkDTO getFieldWorkDTO) {
        getFieldWorkDTO.setCropFieldId(fieldWork.getCropFieldVersion().getUid());
        getFieldWorkDTO.setWorkTypeId(fieldWork.getWorkType().getUid());
        getFieldWorkDTO.setWorkTypeName(fieldWork.getWorkType().getName());

        getFieldWorkDTO.setStartDate(fieldWork.getStartDate().toString());
        if (fieldWork.getEndDate() == null) {
            getFieldWorkDTO.setEndDate("");
        } else {
            getFieldWorkDTO.setEndDate(fieldWork.getEndDate().toString());
        }
    }

    @Mapping(target = "startDate", ignore = true)
    @Mapping(target = "endDate", ignore = true)
    public abstract GetPreviousWorkDTO modelToGetPreviousWork(FieldWork fieldWork);

    @AfterMapping
    protected void afterModelToGetPrevious(FieldWork fieldWork, @MappingTarget GetPreviousWorkDTO getPreviousWorkDTO) {
        getPreviousWorkDTO.setWorkTypeId(fieldWork.getWorkType().getUid());
        getPreviousWorkDTO.setWorkTypeName(fieldWork.getWorkType().getName());
        getPreviousWorkDTO.setCropFieldId(fieldWork.getCropFieldVersion().getUid());
        getPreviousWorkDTO.setCropFieldName(fieldWork.getCropFieldVersion().getCropField().getName());

        getPreviousWorkDTO.setStartDate(fieldWork.getStartDate().toString());
        if (fieldWork.getEndDate() == null) {
            getPreviousWorkDTO.setEndDate("");
        } else {
            getPreviousWorkDTO.setEndDate(fieldWork.getEndDate().toString());
        }
    }

    @Mapping(target = "startDate", ignore = true)
    @Mapping(target = "endDate", ignore = true)
    public abstract GetWorkStatDTO modelToGetWorkStat(FieldWork fieldWork);

    @AfterMapping
    protected void afterModelToGetWorkStat(FieldWork fieldWork, @MappingTarget GetWorkStatDTO getWorkStatDTO) {
        getWorkStatDTO.setWorkTypeId(fieldWork.getWorkType().getUid());
        getWorkStatDTO.setWorkTypeName(fieldWork.getWorkType().getName());
        getWorkStatDTO.setCropFieldVersionId(fieldWork.getCropFieldVersion().getUid());
        getWorkStatDTO.setCropFieldId((fieldWork.getCropFieldVersion().getCropField().getUid()));

        getWorkStatDTO.setStartDate(fieldWork.getStartDate().toString());
        if (fieldWork.getEndDate() == null) {
            getWorkStatDTO.setEndDate("");
        } else {
            getWorkStatDTO.setEndDate(fieldWork.getEndDate().toString());
        }
    }
}
