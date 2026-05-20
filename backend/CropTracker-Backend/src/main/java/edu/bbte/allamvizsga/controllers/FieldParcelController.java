package edu.bbte.allamvizsga.controllers;

import edu.bbte.allamvizsga.dto.request.fieldParcel.CreateFieldParcelDTO;
import edu.bbte.allamvizsga.dto.request.fieldParcel.UpdateFieldParcelDTO;
import edu.bbte.allamvizsga.dto.response.fieldParcel.GetFieldParcelDTO;
import edu.bbte.allamvizsga.exceptions.BadRequestException;
import edu.bbte.allamvizsga.exceptions.ForbiddenException;
import edu.bbte.allamvizsga.mappers.FieldParcelMapper;
import edu.bbte.allamvizsga.model.CropCultivar;
import edu.bbte.allamvizsga.model.CropField;
import edu.bbte.allamvizsga.model.FieldParcel;
import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.services.CropCultivarService;
import edu.bbte.allamvizsga.services.CropFieldService;
import edu.bbte.allamvizsga.services.FieldParcelService;
import edu.bbte.allamvizsga.services.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.locationtech.jts.geom.Polygon;
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

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public void createFieldParcel(@Valid @RequestBody CreateFieldParcelDTO createFieldParcelDTO,
                                @RequestHeader("Authorization") String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);

        UUID cropFieldId = UUID.fromString(createFieldParcelDTO.getCropFieldId());
        CropField cropField = cropFieldService.findCropFieldByUser(cropFieldId, user);

        UUID cropCultivarId = UUID.fromString(createFieldParcelDTO.getCropCultivarId());
        CropCultivar cropCultivar = cropCultivarService.findByID(cropCultivarId);

        FieldParcel fieldParcel = fieldParcelMapper.createFieldParcelDTOtoModel(createFieldParcelDTO);
        fieldParcel.setCropField(cropField);
        fieldParcel.setCropCultivar(cropCultivar);

        fieldParcelService.createFieldParcel(fieldParcel);
    }

    @PutMapping("/update")
    public void updateCropField(@Valid @RequestBody UpdateFieldParcelDTO updateFieldParcelDTO,
                                @RequestParam(name = "id") String parcelId,
                                @RequestHeader("Authorization") String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);

        UUID cropFieldId = UUID.fromString(updateFieldParcelDTO.getCropFieldId());
        CropField cropField = cropFieldService.findCropFieldByUser(cropFieldId, user);

        UUID cropCultivarId = UUID.fromString(updateFieldParcelDTO.getCropCultivarId());
        CropCultivar cropCultivar = cropCultivarService.findByID(cropCultivarId);

        FieldParcel updatedFieldParcel = fieldParcelMapper.updateFieldParcelDTOtoModel(updateFieldParcelDTO);
        updatedFieldParcel.setCropCultivar(cropCultivar);
        updatedFieldParcel.setCropField(cropField);
        UUID fieldParcelId = UUID.fromString(parcelId);
        updatedFieldParcel.setUid(fieldParcelId);

        fieldParcelService.updateFieldParcel(updatedFieldParcel);
    }

    @GetMapping("/findall")
    public ResponseEntity<Collection<GetFieldParcelDTO>> getCropFields(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(name = "cropFieldId") String cropFieldId) {
        System.out.println("RECEIVED: " + cropFieldId);
        User user = userService.extractUser(authorizationHeader);

        UUID fieldId = UUID.fromString(cropFieldId);
        CropField cropField = cropFieldService.findById(fieldId);

        if (user != cropField.getUser()) {
            throw new ForbiddenException("You cannot request the field parcels of this crop field");
        }

        Collection<FieldParcel> fieldParcels = fieldParcelService.getFieldParcels(cropField);

        Collection<GetFieldParcelDTO> getFieldParcelDTOS = fieldParcels.stream().map(fieldParcelMapper::modelToGetFieldParcelDTO).toList();
        return ResponseEntity.ok(getFieldParcelDTOS);
    }

    @GetMapping("/findby")
    public ResponseEntity<GetFieldParcelDTO> getCropFieldById(
            @RequestParam(name = "id") String fieldParcelId
    ) {
        FieldParcel fieldParcel = fieldParcelService.findByID(UUID.fromString(fieldParcelId));
        GetFieldParcelDTO getFieldParcelDTO = fieldParcelMapper.modelToGetFieldParcelDTO(fieldParcel);
        return ResponseEntity.ok(getFieldParcelDTO);
    }

    @DeleteMapping("/delete")
    public void deleteCropFieldById(@RequestParam(name = "id") String fieldParcelId) {
        fieldParcelService.deleteById(UUID.fromString(fieldParcelId));
    }
}
