package edu.bbte.allamvizsga.mappers;

import edu.bbte.allamvizsga.dto.request.workTypes.CreateWorkTypeDTO;
import edu.bbte.allamvizsga.dto.response.workTypes.GetWorkTypeDTO;
import edu.bbte.allamvizsga.model.WorkType;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface WorkTypesMapper {
    GetWorkTypeDTO modelToGetWorkTypesDTO(WorkType workType);

    WorkType createWorkTypesDTOtoModel(CreateWorkTypeDTO createWorkTypeDTO);
}
