package edu.bbte.allamvizsga.controllers;

import edu.bbte.allamvizsga.dto.request.cropSpecie.CreateCropSpecieDTO;
import edu.bbte.allamvizsga.dto.request.cropSpecie.UpdateCropSpecieDTO;
import edu.bbte.allamvizsga.dto.response.cropSpecie.GetCropSpecieDTO;
import edu.bbte.allamvizsga.mappers.CropSpecieMapper;
import edu.bbte.allamvizsga.model.CropCategory;
import edu.bbte.allamvizsga.model.CropSpecie;
import edu.bbte.allamvizsga.repository.CropSpecieRepository;
import edu.bbte.allamvizsga.services.CropCategoryService;
import edu.bbte.allamvizsga.services.CropSpecieService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Collections;
import java.util.UUID;

@RestController
@RequestMapping("/api/crop-species")
@CrossOrigin(value = "http://localhost:5174")
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
@PreAuthorize("hasRole('GROWER')")
public class CropSpecieController {
    private final CropSpecieService cropSpecieService;
    private final CropCategoryService cropCategoryService;
    private final CropSpecieMapper cropSpecieMapper;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public void create(@Valid @RequestBody CreateCropSpecieDTO createCropSpecieDTO) {
        CropCategory cropCategory = cropCategoryService.findByName(createCropSpecieDTO.getSpecieTypeName());
        CropSpecie newCropSpecie = cropSpecieMapper.createCropSpecieToModel(createCropSpecieDTO);
        newCropSpecie.setCropCategory(cropCategory);
        cropSpecieService.create(newCropSpecie);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update")
    public void update(@Valid @RequestBody UpdateCropSpecieDTO updateCropSpecieDTO,
                       @RequestParam("id") String specieId) {
        CropCategory cropCategory = cropCategoryService.findByName(updateCropSpecieDTO.getSpecieTypeName());
        CropSpecie updatedCropSpecie = cropSpecieMapper.updateCropSpecieToModel(updateCropSpecieDTO);
        UUID cropSpecieId = UUID.fromString(specieId);
        updatedCropSpecie.setUid(cropSpecieId);
        updatedCropSpecie.setCropCategory(cropCategory);
        cropSpecieService.update(updatedCropSpecie);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete")
    public void delete(@RequestParam("id") String specieId) {
        UUID cropSpecieId = UUID.fromString(specieId);
        cropSpecieService.delete(cropSpecieId);
    }

    @GetMapping(value = "/findall", params = "categoryName")
    public ResponseEntity<Collection<GetCropSpecieDTO>> findAllByCategory(
            @RequestParam("categoryName") String categoryName
    ) {
        CropCategory cropCategory = cropCategoryService.findByName(categoryName);
        Collection<CropSpecie> cropSpecies = cropSpecieService.findAllByCategory(cropCategory);

        return ResponseEntity.ok(cropSpecies.stream().map(cropSpecieMapper::modelToGetCropSpecie).toList());
    }

    @GetMapping(value = "/findall", params = "pattern")
    public ResponseEntity<Collection<GetCropSpecieDTO>> findAllWithPattern(
            @RequestParam("pattern") String pattern
    ) {
        Collection<CropSpecie> cropSpecies = cropSpecieService.findAllWithPatter(pattern);

        return ResponseEntity.ok(cropSpecies.stream().map(cropSpecieMapper::modelToGetCropSpecie).toList());
    }

}
