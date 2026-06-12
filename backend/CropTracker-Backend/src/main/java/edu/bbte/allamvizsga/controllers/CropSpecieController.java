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
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Collection;
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
    public ResponseEntity<GetCropSpecieDTO> create(@Valid @RequestBody CreateCropSpecieDTO createCropSpecieDTO) {
        String cropCategoryId = createCropSpecieDTO.getCategoryId();
        UUID categoryId = UUID.fromString(cropCategoryId);
        CropCategory cropCategory = cropCategoryService.findByID(categoryId);
        CropSpecie newCropSpecie = cropSpecieMapper.createCropSpecieToModel(createCropSpecieDTO);
        newCropSpecie.setCropCategory(cropCategory);
        CropSpecie createdCropSpecie = cropSpecieService.create(newCropSpecie);

        GetCropSpecieDTO getCropSpecieDTO = cropSpecieMapper.modelToGetCropSpecie(createdCropSpecie);
        getCropSpecieDTO.setCategoryId(createdCropSpecie.getCropCategory().getUid());
        return new ResponseEntity<>(getCropSpecieDTO, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update")
    public ResponseEntity<GetCropSpecieDTO> update(@Valid @RequestBody UpdateCropSpecieDTO updateCropSpecieDTO,
                       @RequestParam("id") String specieId) {
        String cropCategoryId = updateCropSpecieDTO.getCategoryId();
        UUID categoryId = UUID.fromString(cropCategoryId);
        CropCategory cropCategory = cropCategoryService.findByID(categoryId);
        CropSpecie updatedCropSpecie = cropSpecieMapper.updateCropSpecieToModel(updateCropSpecieDTO);
        UUID cropSpecieId = UUID.fromString(specieId);
        updatedCropSpecie.setUid(cropSpecieId);
        updatedCropSpecie.setCropCategory(cropCategory);
        cropSpecieService.update(updatedCropSpecie);

        GetCropSpecieDTO getCropSpecieDTO = cropSpecieMapper.modelToGetCropSpecie(updatedCropSpecie);
        getCropSpecieDTO.setCategoryId(updatedCropSpecie.getCropCategory().getUid());
        return new ResponseEntity<>(getCropSpecieDTO, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete")
    public void delete(@RequestParam("id") String specieId) {
        UUID cropSpecieId = UUID.fromString(specieId);
        cropSpecieService.delete(cropSpecieId);
    }

    @GetMapping(value = "/findall", params = "categoryId")
    public ResponseEntity<Collection<GetCropSpecieDTO>> findAllByCategory(
            @RequestParam("categoryId") String cropCategoryId
    ) {
        UUID categoryId = UUID.fromString(cropCategoryId);
        CropCategory cropCategory = cropCategoryService.findByID(categoryId);
        Collection<CropSpecie> cropSpecies = cropSpecieService.findAllByCategory(cropCategory);

        return ResponseEntity.ok(cropSpecies.stream().map(cropSpecie -> {
            GetCropSpecieDTO getCropSpecieDTO = cropSpecieMapper.modelToGetCropSpecie(cropSpecie);
            getCropSpecieDTO.setCategoryId(cropSpecie.getCropCategory().getUid());
            return getCropSpecieDTO;
        }).toList());
    }

    @GetMapping(value = "/findall", params = "pattern")
    public ResponseEntity<Collection<GetCropSpecieDTO>> findAllWithPattern(
            @RequestParam("pattern") String pattern
    ) {
        Collection<CropSpecie> cropSpecies = cropSpecieService.findAllWithPattern(pattern);

        return ResponseEntity.ok(cropSpecies.stream().map(cropSpecie -> {
            GetCropSpecieDTO getCropSpecieDTO = cropSpecieMapper.modelToGetCropSpecie(cropSpecie);
            getCropSpecieDTO.setCategoryId(cropSpecie.getCropCategory().getUid());
            return getCropSpecieDTO;
        }).toList());
    }

}
