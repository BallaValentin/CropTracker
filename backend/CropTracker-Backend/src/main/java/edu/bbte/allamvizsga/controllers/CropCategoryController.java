package edu.bbte.allamvizsga.controllers;

import edu.bbte.allamvizsga.dto.response.cropCategory.GetCropCategoryDTO;
import edu.bbte.allamvizsga.mappers.CropCategoryMapper;
import edu.bbte.allamvizsga.model.CropCategory;
import edu.bbte.allamvizsga.services.CropCategoryService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@RestController
@RequestMapping("/api/crop-categories")
@CrossOrigin(value = "http://localhost:5174")
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
@PreAuthorize("hasRole('GROWER')")
public class CropCategoryController {
    private final CropCategoryService cropCategoryService;
    private final CropCategoryMapper cropCategoryMapper;

    @GetMapping("/findall")
    public ResponseEntity<Collection<GetCropCategoryDTO>> getCropCategories() {
        Collection<CropCategory> cropCategories = cropCategoryService.getCropCategories();

        return ResponseEntity.ok(cropCategories.stream().map(cropCategoryMapper::modelToGetCropCategoryDTO)
                .toList());
    }
}
