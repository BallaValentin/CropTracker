package com.edu.bbte.allamvizsga.mappers;

import com.edu.bbte.allamvizsga.dto.request.CreatePlotDTO;
import com.edu.bbte.allamvizsga.dto.response.GetPlotDTO;
import com.edu.bbte.allamvizsga.model.Plot;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PlotMapper {
    public Plot createPlotDTOtoModel(CreatePlotDTO createPlotDTO);
    public GetPlotDTO modelToGetPlotDTO(Plot plot);
}
