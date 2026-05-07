package edu.bbte.allamvizsga.controllers;

import edu.bbte.allamvizsga.dto.request.CreateCropFieldDTO;
import edu.bbte.allamvizsga.dto.request.UpdateCropFieldDTO;
import edu.bbte.allamvizsga.dto.response.GetCropFieldDTO;
import edu.bbte.allamvizsga.mappers.CropFieldMapper;
import edu.bbte.allamvizsga.model.CropField;
import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.services.CropFieldService;
import edu.bbte.allamvizsga.services.UserService;
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
@RequestMapping("/api/cropfield")
@CrossOrigin(value = "http://localhost:5174")
@AllArgsConstructor(onConstructor = @__(@Autowired))
@PreAuthorize("hasRole('GROWER')")
@Slf4j
public class CropFieldController {
    private final CropFieldService cropFieldService;
    private final UserService userService;
    private final CropFieldMapper cropFieldMapper;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public void createPlot(@Valid @RequestBody CreateCropFieldDTO createCropFieldDTO,
                           @RequestHeader("Authorization") String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);
        CropField cropField = cropFieldMapper.createPlotDTOtoModel(createCropFieldDTO);
        cropField.setUser(user);
        cropFieldService.createPlot(cropField);
    }

    @PutMapping("/update")
    public void updatePlot(@Valid @RequestBody UpdateCropFieldDTO updateCropFieldDTO,
                           @RequestParam(name = "id") String plotID,
                           @RequestHeader("Authorization") String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);
        CropField cropField = cropFieldService.findPlotByUser(UUID.fromString(plotID), user);
        cropFieldMapper.updateModelFromUpdatePlotDto(updateCropFieldDTO, cropField);
        cropFieldService.updatePlot(cropField);
    }

    @GetMapping("/findall")
    public ResponseEntity<Collection<GetCropFieldDTO>> getPlots(
            @RequestHeader("Authorization") String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);
        Collection<CropField> cropFields = cropFieldService.getPlots(user);

        Collection<GetCropFieldDTO> getCropFieldDTOS = cropFields.stream().map(cropFieldMapper::modelToGetCropFieldDTO).toList();
        return ResponseEntity.ok(getCropFieldDTOS);
    }

    @GetMapping("/findby")
    public ResponseEntity<GetCropFieldDTO> getPlotById(
            @RequestParam(name = "id") String plotId
    ) {
        UUID uid = UUID.fromString(plotId);
        CropField cropField = cropFieldService.findById(uid);
        GetCropFieldDTO getCropFieldDTO = cropFieldMapper.modelToGetCropFieldDTO(cropField);
        return ResponseEntity.ok(getCropFieldDTO);
    }

    @DeleteMapping("/delete")
    public void deletePlotById(@RequestParam(name = "id") String plotId) {
        UUID uid = UUID.fromString(plotId);
        cropFieldService.deleteById(uid);
    }

}
