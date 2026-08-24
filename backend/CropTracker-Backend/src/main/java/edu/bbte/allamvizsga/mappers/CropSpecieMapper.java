package edu.bbte.allamvizsga.mappers;

import edu.bbte.allamvizsga.dto.request.cropSpecie.CreateCropSpecieDTO;
import edu.bbte.allamvizsga.dto.request.cropSpecie.UpdateCropSpecieDTO;
import edu.bbte.allamvizsga.dto.response.cropSpecie.GetCropSpecieDTO;
import edu.bbte.allamvizsga.model.CropSpecie;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.HashMap;
import java.util.Map;

@Mapper(componentModel = "spring")
public abstract class CropSpecieMapper {
    @Mapping(target = "commonName", ignore = true)
    public abstract CropSpecie createCropSpecieToModel(CreateCropSpecieDTO createCropSpecieDTO);

    @AfterMapping
    protected void afterCreateToModel(CreateCropSpecieDTO createCropSpecieDTO, @MappingTarget CropSpecie cropSpecie) {
        Map<String, String> translations = new HashMap<>();
        translations.put("en", createCropSpecieDTO.getCommonName());
        translations.put("hu", createCropSpecieDTO.getHungarianName().trim());
        translations.put("ro", createCropSpecieDTO.getRomanianName().trim());

        cropSpecie.setCommonName(translations);
    }

    @Mapping(target = "commonName", ignore = true)
    public abstract CropSpecie updateCropSpecieToModel(UpdateCropSpecieDTO updateCropSpecieDTO);

    @AfterMapping
    protected void afterUpdateToModel(UpdateCropSpecieDTO updateCropSpecieDTO, @MappingTarget CropSpecie cropSpecie) {
        Map<String, String> translations = new HashMap<>();
        translations.put("en", updateCropSpecieDTO.getCommonName());
        translations.put("hu", updateCropSpecieDTO.getHungarianName().trim());
        translations.put("ro", updateCropSpecieDTO.getRomanianName().trim());

        cropSpecie.setCommonName(translations);
    }

    public abstract GetCropSpecieDTO modelToGetCropSpecie(CropSpecie cropSpecie);
}
