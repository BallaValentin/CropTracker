package edu.bbte.allamvizsga.controllers;

import edu.bbte.allamvizsga.dto.request.fieldParcel.CreateFieldParcelDTO;
import edu.bbte.allamvizsga.dto.request.fieldParcel.UpdateFieldParcelDTO;
import edu.bbte.allamvizsga.dto.response.fieldParcel.GetFieldParcelDTO;
import edu.bbte.allamvizsga.exceptions.BadRequestException;
import edu.bbte.allamvizsga.mappers.FieldParcelMapper;
import edu.bbte.allamvizsga.mappers.FieldParcelVersionMapper;
import edu.bbte.allamvizsga.model.*;
import edu.bbte.allamvizsga.services.CropCultivarService;
import edu.bbte.allamvizsga.services.CropFieldService;
import edu.bbte.allamvizsga.services.FieldParcelService;
import edu.bbte.allamvizsga.services.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.awt.*;
import java.util.Collection;
import java.util.UUID;

@RestController
@RequestMapping("/api/field-parcel")
@CrossOrigin(value = "http://localhost:5174")
@AllArgsConstructor(onConstructor = @__(@Autowired))
@PreAuthorize("hasRole('GROWER')")
public class FieldParcelController {
    private final UserService userService;
    private final CropFieldService cropFieldService;
    private final FieldParcelService fieldParcelService;
    private final CropCultivarService cropCultivarService;
    private final FieldParcelMapper fieldParcelMapper;
    private final FieldParcelVersionMapper fieldParcelVersionMapper;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public void createFieldParcel(@Valid @RequestBody CreateFieldParcelDTO createFieldParcelDTO,
                                  @RequestHeader("Authorization") String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);

        CropFieldVersion cropFieldVersion = cropFieldService.findById(
                createFieldParcelDTO.getCropFieldId(), user);

        CropCultivar cropCultivar = cropCultivarService.findByID(createFieldParcelDTO.getCropCultivarId());

        FieldParcel fieldParcel = fieldParcelMapper.createFieldParcelToModel(createFieldParcelDTO);
        FieldParcelVersion fieldParcelVersion = fieldParcelVersionMapper.createFieldParcelToModel(createFieldParcelDTO);
        fieldParcel.setCropField(cropFieldVersion.getCropField());
        fieldParcelVersion.setCropCultivar(cropCultivar);

        fieldParcelService.createFieldParcel(fieldParcel, fieldParcelVersion);
    }

    @PutMapping("/update")
    public void updateFieldParcel(@Valid @RequestBody UpdateFieldParcelDTO updateFieldParcelDTO,
                                  @RequestParam(name = "id") UUID fieldParcelId,
                                  @RequestHeader("Authorization") String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);

        cropFieldService.findById(updateFieldParcelDTO.getCropFieldId(), user);

        CropCultivar cropCultivar = cropCultivarService.findByID(updateFieldParcelDTO.getCropCultivarId());

        FieldParcelVersion newFieldParcelVersion = fieldParcelVersionMapper.updateFieldParcelDTOtoModel(updateFieldParcelDTO);
        newFieldParcelVersion.setCropCultivar(cropCultivar);

        fieldParcelService.updateFieldParcel(fieldParcelId, newFieldParcelVersion);
    }

    @GetMapping("/findall")
    public ResponseEntity<Collection<GetFieldParcelDTO>> getFieldParcels(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(name = "cropFieldId", required = false) UUID cropFieldId,
            @RequestParam(name = "cropFieldVersionId", required = false) UUID cropFieldVersionId) {

        if ((cropFieldId == null && cropFieldVersionId == null) || (cropFieldId != null && cropFieldVersionId != null)) {
            throw new BadRequestException("Either cropFieldId or cropFieldVersion must be added.");
        }

        User user = userService.extractUser(authorizationHeader);

        CropFieldVersion cropFieldVersion = null;

        if (cropFieldId != null) {
            cropFieldVersion = cropFieldService.findById(cropFieldId, user);
        }

        if (cropFieldVersionId != null) {
            cropFieldVersion = cropFieldService.findByVersionId(cropFieldVersionId, user);
        }

        Collection<FieldParcelVersion> fieldParcelVersions = fieldParcelService.getFieldParcels(cropFieldVersion);

        Collection<GetFieldParcelDTO> getFieldParcelDTOS = fieldParcelVersions.stream().map(fieldParcelVersionMapper::modelToGetFieldParcel).toList();
        return ResponseEntity.ok(getFieldParcelDTOS);
    }

    @GetMapping("/findby")
    public ResponseEntity<GetFieldParcelDTO> getFieldParcelById(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(name = "fieldParcelId", required = false) UUID fieldParcelId,
            @RequestParam(name = "fieldParcelVersionId", required = false) UUID fieldParcelVersionId
    ) {
        if ((fieldParcelId == null && fieldParcelVersionId == null) || (fieldParcelId != null && fieldParcelVersionId != null)) {
            throw new BadRequestException("Either field parcel ot field parcel version must be defined.");
        }
        User user = userService.extractUser(authorizationHeader);

        FieldParcelVersion fieldParcelVersion = null;
        if (fieldParcelId != null) {
            fieldParcelVersion = fieldParcelService.findByID(fieldParcelId, user);
        }
        if (fieldParcelVersionId != null) {
            fieldParcelVersion = fieldParcelService.findByVersionID(fieldParcelVersionId, user);
        }

        GetFieldParcelDTO getFieldParcelDTO = fieldParcelVersionMapper.modelToGetFieldParcel(fieldParcelVersion);
        return ResponseEntity.ok(getFieldParcelDTO);
    }

    @DeleteMapping("/delete")
    public void deleteCropFieldById(@RequestParam(name = "id") UUID fieldParcelId) {
        fieldParcelService.deleteById(fieldParcelId);
    }
}
