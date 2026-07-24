package edu.bbte.allamvizsga.mappers;

import edu.bbte.allamvizsga.dto.request.cropCultivar.CreateCropCultivarDTO;
import edu.bbte.allamvizsga.dto.request.cropCultivar.UpdateCropCultivarDTO;
import edu.bbte.allamvizsga.dto.response.cropCultivar.GetCropCultivarDTO;
import edu.bbte.allamvizsga.dto.response.cropCultivar.GetSimpleCropCultivarDTO;
import edu.bbte.allamvizsga.model.CropCultivar;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CropCultivarMapper {
    CropCultivar createCropCultivarToModel(CreateCropCultivarDTO createCropCultivarDTO);
    CropCultivar updateCropCultivarToModel(UpdateCropCultivarDTO updateCropCultivarDTO);
    GetCropCultivarDTO modelToGetCropCultivar(CropCultivar cropCultivar);
    GetSimpleCropCultivarDTO modelToGetSimpleCropCultivar(CropCultivar cropCultivar);
}
