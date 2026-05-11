package edu.bbte.allamvizsga.mappers;

import edu.bbte.allamvizsga.dto.request.cropSpecie.CreateCropSpecieDTO;
import edu.bbte.allamvizsga.dto.request.cropSpecie.UpdateCropSpecieDTO;
import edu.bbte.allamvizsga.dto.response.cropSpecie.GetCropSpecieDTO;
import edu.bbte.allamvizsga.model.CropSpecie;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CropSpecieMapper {
    CropSpecie createCropSpecieToModel(CreateCropSpecieDTO createCropSpecieDTO);

    CropSpecie updateCropSpecieToModel(UpdateCropSpecieDTO updateCropSpecieDTO);

    GetCropSpecieDTO modelToGetCropSpecie(CropSpecie cropSpecie);
}
