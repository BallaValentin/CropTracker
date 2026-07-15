package edu.bbte.allamvizsga.controllers;

import edu.bbte.allamvizsga.dto.request.cropfield.CreateCropFieldDTO;
import edu.bbte.allamvizsga.dto.request.cropfield.UpdateCropFieldDTO;
import edu.bbte.allamvizsga.dto.response.cropfield.GetCropFieldDTO;
import edu.bbte.allamvizsga.dto.response.cropfield.GetCropFieldNameDTO;
import edu.bbte.allamvizsga.mappers.CropFieldMapper;
import edu.bbte.allamvizsga.mappers.CropFieldVersionMapper;
import edu.bbte.allamvizsga.model.*;
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
    private final CropFieldVersionMapper cropFieldVersionMapper;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public void createCropField(@Valid @RequestBody CreateCropFieldDTO createCropFieldDTO,
                                @RequestHeader("Authorization") String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);

        CropField cropField = cropFieldMapper.createCropFieldDTOtoModel(createCropFieldDTO);
        CropFieldVersion cropFieldVersion = cropFieldVersionMapper.createCropFieldToModel(createCropFieldDTO);

        cropField.setUser(user);
        cropFieldService.createCropField(cropField, cropFieldVersion);
    }

    @PutMapping("/update")
    public void updateCropField(@Valid @RequestBody UpdateCropFieldDTO updateCropFieldDTO,
                                @RequestParam(name = "id") UUID cropFieldId,
                                @RequestHeader("Authorization") String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);
        CropFieldVersion cropFieldVersion = cropFieldVersionMapper.updateCropFieldToModel(updateCropFieldDTO);
        cropFieldService.updateCropField(cropFieldId, updateCropFieldDTO.getName(), user, cropFieldVersion);
    }

    @GetMapping("/findall")
    public ResponseEntity<Collection<GetCropFieldDTO>> getCropFields(
            @RequestHeader("Authorization") String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);
        Collection<CropFieldVersion> cropFieldVersions = cropFieldService.getCropFieldVersions(user);

        Collection<GetCropFieldDTO> getCropFieldDTOS = cropFieldVersions.stream().map(
                cropFieldVersionMapper::modelToGetCropField
        ).toList();
        return ResponseEntity.ok(getCropFieldDTOS);
    }

    @GetMapping(value = "/findall", params = "pattern")
    public ResponseEntity<Collection<GetCropFieldNameDTO>> getWorkTypesByPattern(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam("pattern") String pattern) {
        User user = userService.extractUser(authorizationHeader);

        Collection<CropField> cropFields = cropFieldService.findByPattern(user, pattern);

        return ResponseEntity.ok(cropFields.stream().map(cropFieldMapper::modelToGetCropFieldName).toList());
    }

    @GetMapping(value = "/findby", params = "id")
    public ResponseEntity<GetCropFieldDTO> getCropFieldById(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(name = "id") UUID cropFieldId
    ) {

        User user = userService.extractUser(authorizationHeader);
        CropFieldVersion cropFieldVersion = cropFieldService.findById(cropFieldId, user);
        GetCropFieldDTO getCropFieldDTO = cropFieldVersionMapper.modelToGetCropField(cropFieldVersion);
        return ResponseEntity.ok(getCropFieldDTO);
    }

    @GetMapping(value = "/findby", params = "fieldWorkId")
    public ResponseEntity<GetCropFieldDTO> getCropFieldByFieldWorkId(
            @RequestParam(name = "fieldWorkId") UUID fieldWorkId,
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        User user = userService.extractUser(authorizationHeader);

        FieldWork fieldWork = fieldWorkService.findById(fieldWorkId, user);
        CropFieldVersion cropFieldVersion = fieldWork.getCropFieldVersion();

        GetCropFieldDTO getCropFieldDTO = cropFieldVersionMapper.modelToGetCropField(cropFieldVersion);

        return ResponseEntity.ok(getCropFieldDTO);
    }

    @DeleteMapping("/delete")
    public void deleteCropFieldById(@RequestHeader("Authorization") String authorizationHeader,
                                    @RequestParam(name = "id") UUID cropFieldId) {
        User user = userService.extractUser(authorizationHeader);
        cropFieldService.deleteById(cropFieldId, user);
    }

}
