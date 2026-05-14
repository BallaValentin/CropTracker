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
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<GetCropCultivarDTO> create(@Valid @RequestBody CreateCropCultivarDTO createCropCultivarDTO) {
        String cropSpecieId = createCropCultivarDTO.getSpecieId();
        UUID specieId = UUID.fromString(cropSpecieId);
        CropSpecie cropSpecie = cropSpecieService.findByID(specieId);
        CropCultivar cropCultivar = cropCultivarMapper.createCropCultivarToModel(createCropCultivarDTO);
        cropCultivar.setCropSpecie(cropSpecie);

        CropCultivar createdCropCultivar = cropCultivarService.create(cropCultivar);

        GetCropCultivarDTO getCropCultivarDTO = cropCultivarMapper.modelToGetCropCultivar(createdCropCultivar);
        getCropCultivarDTO.setSpecieId(createdCropCultivar.getCropSpecie().getUid());
        getCropCultivarDTO.setSpecieName(createdCropCultivar.getCropSpecie().getCommonName());

        return new ResponseEntity<>(getCropCultivarDTO, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update")
    public ResponseEntity<GetCropCultivarDTO> create(@Valid @RequestBody UpdateCropCultivarDTO updateCropCultivarDTO,
                       @RequestParam("id") String cropCultivarId) {
        String cropSpecieId = updateCropCultivarDTO.getSpecieId();
        UUID specieId = UUID.fromString(cropSpecieId);
        UUID cultivarId = UUID.fromString(cropCultivarId);

        CropSpecie cropSpecie = cropSpecieService.findByID(specieId);
        CropCultivar cropCultivar = cropCultivarMapper.updateCropCultivarToModel(updateCropCultivarDTO);
        cropCultivar.setCropSpecie(cropSpecie);
        cropCultivar.setUid(cultivarId);

        cropCultivarService.update(cropCultivar);

        GetCropCultivarDTO getCropCultivarDTO = cropCultivarMapper.modelToGetCropCultivar(cropCultivar);
        getCropCultivarDTO.setSpecieId(cropCultivar.getCropSpecie().getUid());
        getCropCultivarDTO.setSpecieName(cropCultivar.getCropSpecie().getCommonName());

        return new ResponseEntity<>(getCropCultivarDTO, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete")
    public void create(@RequestParam("id") String cropCultivarId) {
        UUID cultivarId = UUID.fromString(cropCultivarId);

        cropCultivarService.delete(cultivarId);
    }

    @GetMapping(value = "/findall", params = "specieId")
    public ResponseEntity<Collection<GetCropCultivarDTO>> findAllInSpecie(
            @RequestParam("specieId") String cropSpecieId
    ) {
        UUID specieId = UUID.fromString(cropSpecieId);
        CropSpecie cropSpecie = cropSpecieService.findByID(specieId);
        Collection<CropCultivar> cropCultivars = cropCultivarService.findAllInSpecie(cropSpecie);

        return ResponseEntity.ok(cropCultivars.stream().map(cropCultivar -> {
            GetCropCultivarDTO getCropCultivarDTO = cropCultivarMapper.modelToGetCropCultivar(cropCultivar);
            getCropCultivarDTO.setSpecieName(cropCultivar.getCropSpecie().getCommonName());
            getCropCultivarDTO.setSpecieId(cropCultivar.getCropSpecie().getUid());
            return getCropCultivarDTO;
        }).toList());
    }

    @GetMapping(value = "/findall", params = "pattern")
    public ResponseEntity<Collection<GetCropCultivarDTO>> findAllWithPattern(
            @RequestParam("pattern") String pattern
    ) {
        Collection<CropCultivar> cropCultivars = cropCultivarService.findAllWithPattern(pattern);

        return ResponseEntity.ok(cropCultivars.stream().map(cropCultivar -> {
            GetCropCultivarDTO getCropCultivarDTO = cropCultivarMapper.modelToGetCropCultivar(cropCultivar);
            getCropCultivarDTO.setSpecieName(cropCultivar.getCropSpecie().getCommonName());
            getCropCultivarDTO.setSpecieId(cropCultivar.getCropSpecie().getUid());
            return getCropCultivarDTO;
        }).toList());
    }
}
