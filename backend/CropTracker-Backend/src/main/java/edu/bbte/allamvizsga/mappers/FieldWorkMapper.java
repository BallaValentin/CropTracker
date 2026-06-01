package edu.bbte.allamvizsga.mappers;

import edu.bbte.allamvizsga.dto.request.fieldWork.CreateFieldWorkDTO;
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
}
