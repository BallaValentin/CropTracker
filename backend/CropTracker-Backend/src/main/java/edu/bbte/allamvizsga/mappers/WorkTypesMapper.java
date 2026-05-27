package edu.bbte.allamvizsga.mappers;

import edu.bbte.allamvizsga.dto.response.workTypes.GetWorkTypesDTO;
import edu.bbte.allamvizsga.model.WorkTypes;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface WorkTypesMapper {
    GetWorkTypesDTO modelToGetWorkTypesDTO(WorkTypes workTypes);
}
