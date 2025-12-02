package com.edu.bbte.allamvizsga.mappers;

import com.edu.bbte.allamvizsga.dto.request.CreatePlotDTO;
import com.edu.bbte.allamvizsga.dto.request.UpdatePlotDTO;
import com.edu.bbte.allamvizsga.dto.response.GetPlotDTO;
import com.edu.bbte.allamvizsga.model.Plot;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface PlotMapper {
    Plot createPlotDTOtoModel(CreatePlotDTO createPlotDTO);
    GetPlotDTO modelToGetPlotDTO(Plot plot);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateModelFromUpdatePlotDto(UpdatePlotDTO updatePlotDTO, @MappingTarget Plot plot);
}
