package edu.bbte.allamvizsga.controllers;

import edu.bbte.allamvizsga.dto.request.cropCultivar.CreateCropCultivarDTO;
import edu.bbte.allamvizsga.dto.request.cropCultivar.UpdateCropCultivarDTO;
import edu.bbte.allamvizsga.dto.response.cropCultivar.GetCropCultivarDTO;
import edu.bbte.allamvizsga.mappers.CropCultivarMapper;
import edu.bbte.allamvizsga.model.CropCultivar;
import edu.bbte.allamvizsga.model.CropSpecie;
import edu.bbte.allamvizsga.services.CropCultivarService;
import edu.bbte.allamvizsga.services.CropSpecieService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.UUID;

@RestController
@RequestMapping("/api/crop-cultivars")
@CrossOrigin(value = "http://localhost:5174")
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
@PreAuthorize("hasRole('GROWER')")
public class CropCultivarController {
    private final CropSpecieService cropSpecieService;
    private final CropCultivarService cropCultivarService;
    private final CropCultivarMapper cropCultivarMapper;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public void create(@Valid @RequestBody CreateCropCultivarDTO createCropCultivarDTO) {
        String specieName = createCropCultivarDTO.getSpecieName();
        CropSpecie cropSpecie = cropSpecieService.findBySpecieName(specieName);
        CropCultivar cropCultivar = cropCultivarMapper.createCropCultivarToModel(createCropCultivarDTO);
        cropCultivar.setCropSpecie(cropSpecie);

        cropCultivarService.create(cropCultivar);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update")
    public void create(@Valid @RequestBody UpdateCropCultivarDTO updateCropCultivarDTO,
                       @RequestParam("id") String cropCultivarId) {
        String specieName = updateCropCultivarDTO.getSpecieName();
        UUID cultivarId = UUID.fromString(cropCultivarId);

        CropSpecie cropSpecie = cropSpecieService.findBySpecieName(specieName);
        CropCultivar cropCultivar = cropCultivarMapper.updateCropCultivarToModel(updateCropCultivarDTO);
        cropCultivar.setCropSpecie(cropSpecie);
        cropCultivar.setUid(cultivarId);

        cropCultivarService.update(cropCultivar);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete")
    public void create(@RequestParam("id") String cropCultivarId) {
        UUID cultivarId = UUID.fromString(cropCultivarId);

        cropCultivarService.delete(cultivarId);
    }

    @GetMapping(value = "/findall", params = "specieName")
    public ResponseEntity<Collection<GetCropCultivarDTO>> findAllInSpecie(
            @RequestParam("specieName") String specieName
    ) {
        CropSpecie cropSpecie = cropSpecieService.findBySpecieName(specieName);
        Collection<CropCultivar> cropCultivars = cropCultivarService.findAllInSpecie(cropSpecie);

        return ResponseEntity.ok(cropCultivars.stream().map(cropCultivarMapper::modelToGetCropCultivar).toList());
    }

    @GetMapping(value = "/findall", params = "pattern")
    public ResponseEntity<Collection<GetCropCultivarDTO>> findAllWithPattern(
            @RequestParam("pattern") String pattern
    ) {
        Collection<CropCultivar> cropCultivars = cropCultivarService.findAllWithPattern(pattern);

        return ResponseEntity.ok(cropCultivars.stream().map(cropCultivar -> {
            GetCropCultivarDTO getCropCultivarDTO = cropCultivarMapper.modelToGetCropCultivar(cropCultivar);
            getCropCultivarDTO.setSpecieName(cropCultivar.getCropSpecie().getCommonName());
            return getCropCultivarDTO;
        }).toList());
    }
}
