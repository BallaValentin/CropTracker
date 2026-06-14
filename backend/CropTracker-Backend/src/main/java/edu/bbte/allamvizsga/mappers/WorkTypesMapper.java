package edu.bbte.allamvizsga.mappers;

import edu.bbte.allamvizsga.dto.request.workType.CreateWorkTypeDTO;
import edu.bbte.allamvizsga.dto.response.workType.GetWorkTypeDTO;
import edu.bbte.allamvizsga.model.WorkType;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface WorkTypesMapper {
    GetWorkTypeDTO modelToGetWorkTypesDTO(WorkType workType);

    WorkType createWorkTypesDTOtoModel(CreateWorkTypeDTO createWorkTypeDTO);
}
