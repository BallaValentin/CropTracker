package edu.bbte.allamvizsga.controllers;

import edu.bbte.allamvizsga.dto.request.cropfield.CreateCropFieldDTO;
import edu.bbte.allamvizsga.dto.request.cropfield.UpdateCropFieldDTO;
import edu.bbte.allamvizsga.dto.response.cropfield.GetCropFieldDTO;
import edu.bbte.allamvizsga.mappers.CropFieldMapper;
import edu.bbte.allamvizsga.mappers.FieldParcelMapper;
import edu.bbte.allamvizsga.model.CropField;
import edu.bbte.allamvizsga.model.FieldParcel;
import edu.bbte.allamvizsga.model.FieldWork;
import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.services.CropFieldService;
import edu.bbte.allamvizsga.services.FieldWorkService;
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
    private final FieldWorkService fieldWorkService;
    private final CropFieldMapper cropFieldMapper;
    private final FieldParcelMapper fieldParcelMapper;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public void createCropField(@Valid @RequestBody CreateCropFieldDTO createCropFieldDTO,
                                @RequestHeader("Authorization") String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);
        CropField cropField = cropFieldMapper.createCropFieldDTOtoModel(createCropFieldDTO);
        cropField.setUser(user);
        cropFieldService.createCropField(cropField);
    }

    @PutMapping("/update")
    public void updateCropField(@Valid @RequestBody UpdateCropFieldDTO updateCropFieldDTO,
                                @RequestParam(name = "id") String plotID,
                                @RequestHeader("Authorization") String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);
        CropField cropField = cropFieldService.findCropFieldByUser(UUID.fromString(plotID), user);
        cropFieldMapper.updateModelFromUpdateCropFieldDto(updateCropFieldDTO, cropField);
        cropFieldService.updateCropField(cropField);
    }

    @GetMapping("/findall")
    public ResponseEntity<Collection<GetCropFieldDTO>> getCropFields(
            @RequestHeader("Authorization") String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);
        Collection<CropField> cropFields = cropFieldService.getCropFields(user);

        Collection<GetCropFieldDTO> getCropFieldDTOS = cropFields.stream().map(cropField -> {
            GetCropFieldDTO getCropFieldDTO = cropFieldMapper.modelToGetCropFieldDTO(cropField);
            Collection<FieldParcel> fieldParcels = cropField.getFieldParcels();
            getCropFieldDTO.setFieldParcelDTOS(fieldParcels.stream()
                    .map(fieldParcelMapper::modelToGetFieldParcelDTO)
                    .toList());
            return getCropFieldDTO;
        }).toList();
        return ResponseEntity.ok(getCropFieldDTOS);
    }

    @GetMapping(value = "/findby", params = "id")
    public ResponseEntity<GetCropFieldDTO> getCropFieldById(
            @RequestParam(name = "id") String cropFieldId
    ) {
        UUID uid = UUID.fromString(cropFieldId);
        CropField cropField = cropFieldService.findById(uid);
        Collection<FieldParcel> fieldParcels = cropField.getFieldParcels();
        GetCropFieldDTO getCropFieldDTO = cropFieldMapper.modelToGetCropFieldDTO(cropField);
        getCropFieldDTO.setFieldParcelDTOS(fieldParcels.stream().map(fieldParcelMapper::modelToGetFieldParcelDTO)
                .toList());
        return ResponseEntity.ok(getCropFieldDTO);
    }

    @GetMapping(value = "/findby", params = "fieldWorkId")
    public ResponseEntity<GetCropFieldDTO> getCropFieldByFieldWorkId(
            @RequestParam(name = "fieldWorkId") String workId,
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        UUID uid = UUID.fromString(workId);
        User user = userService.extractUser(authorizationHeader);

        FieldWork fieldWork = fieldWorkService.findById(uid, user);
        CropField cropField = fieldWork.getCropField();

        Collection<FieldParcel> fieldParcels = cropField.getFieldParcels();

        GetCropFieldDTO getCropFieldDTO = cropFieldMapper.modelToGetCropFieldDTO(cropField);
        getCropFieldDTO.setFieldParcelDTOS(fieldParcels.stream().map(fieldParcelMapper::modelToGetFieldParcelDTO)
                .toList());
        return ResponseEntity.ok(getCropFieldDTO);
    }

    @DeleteMapping("/delete")
    public void deleteCropFieldById(@RequestParam(name = "id") String cropFieldId) {
        UUID uid = UUID.fromString(cropFieldId);
        cropFieldService.deleteById(uid);
    }

}
