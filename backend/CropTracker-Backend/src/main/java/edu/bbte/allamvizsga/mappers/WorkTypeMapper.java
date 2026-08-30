package edu.bbte.allamvizsga.mappers;

import edu.bbte.allamvizsga.dto.enums.FieldType;
import edu.bbte.allamvizsga.dto.request.workType.CreateWorkTypeDTO;
import edu.bbte.allamvizsga.dto.response.workType.GetWorkTypeDTO;
import edu.bbte.allamvizsga.dto.response.workType.GetWorkTypeNameDTO;
import edu.bbte.allamvizsga.model.FieldDefinition;
import edu.bbte.allamvizsga.model.WorkType;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.ArrayList;
import java.util.Collection;

@Mapper(componentModel = "spring")
public abstract class WorkTypeMapper {
    public abstract GetWorkTypeDTO modelToGetWorkTypesDTO(WorkType workType);

    public abstract GetWorkTypeNameDTO modelToGetWorkTypeName(WorkType workType);

    public abstract WorkType createWorkTypesDTOtoModel(CreateWorkTypeDTO createWorkTypeDTO);

    @AfterMapping
    protected void afterCreateToModel(CreateWorkTypeDTO createWorkTypeDTO, @MappingTarget WorkType workType) {
            Collection<FieldDefinition> fieldDefinitions = createWorkTypeDTO.getFieldDefinitions().stream().map(
                    createFieldDefinition -> {
                        FieldType fieldType = FieldType.fromAllowedFieldType(createFieldDefinition.getType());
                        boolean hasOptions = !createFieldDefinition.getOptions().isEmpty();

                        return new FieldDefinition(
                                createFieldDefinition.getName(),
                                fieldType,
                                Boolean.FALSE,
                                hasOptions,
                                hasOptions ? createFieldDefinition.getOptions() : new ArrayList<>()
                        );
                    }
            ).toList();

            workType.setFieldDefinitions(fieldDefinitions);
    }
}
