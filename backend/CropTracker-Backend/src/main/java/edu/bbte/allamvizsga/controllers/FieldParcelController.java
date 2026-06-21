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

        CropField cropField = cropFieldService.findCropFieldByUser(
                createFieldParcelDTO.getCropFieldId(), user);

        CropCultivar cropCultivar = cropCultivarService.findByID(createFieldParcelDTO.getCropCultivarId());

        FieldParcel fieldParcel = fieldParcelMapper.createFieldParcelDTOtoModel(createFieldParcelDTO);
        fieldParcel.setCropField(cropField);
        fieldParcel.setCropCultivar(cropCultivar);

        fieldParcelService.createFieldParcel(fieldParcel);
    }

    @PutMapping("/update")
    public void updateCropField(@Valid @RequestBody UpdateFieldParcelDTO updateFieldParcelDTO,
                                @RequestParam(name = "id") UUID fieldParcelId,
                                @RequestHeader("Authorization") String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);

        CropField cropField = cropFieldService.findCropFieldByUser(
                updateFieldParcelDTO.getCropFieldId(), user);

        CropCultivar cropCultivar = cropCultivarService.findByID(updateFieldParcelDTO.getCropCultivarId());

        FieldParcel updatedFieldParcel = fieldParcelMapper.updateFieldParcelDTOtoModel(updateFieldParcelDTO);
        updatedFieldParcel.setCropCultivar(cropCultivar);
        updatedFieldParcel.setCropField(cropField);
        updatedFieldParcel.setUid(fieldParcelId);

        fieldParcelService.updateFieldParcel(updatedFieldParcel);
    }

    @GetMapping("/findall")
    public ResponseEntity<Collection<GetFieldParcelDTO>> getCropFields(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(name = "cropFieldId") UUID cropFieldId) {

        User user = userService.extractUser(authorizationHeader);

        CropField cropField = cropFieldService.findById(cropFieldId);

        if (user != cropField.getUser()) {
            throw new ForbiddenException("You cannot request the field parcels of this crop field");
        }

        Collection<FieldParcel> fieldParcels = fieldParcelService.getFieldParcels(cropField);

        Collection<GetFieldParcelDTO> getFieldParcelDTOS = fieldParcels.stream().map(fieldParcelMapper::modelToGetFieldParcelDTO).toList();
        return ResponseEntity.ok(getFieldParcelDTOS);
    }

    @GetMapping("/findby")
    public ResponseEntity<GetFieldParcelDTO> getCropFieldById(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(name = "id") UUID fieldParcelId
    ) {
        User user = userService.extractUser(authorizationHeader);
        FieldParcel fieldParcel = fieldParcelService.findByID(fieldParcelId, user);
        GetFieldParcelDTO getFieldParcelDTO = fieldParcelMapper.modelToGetFieldParcelDTO(fieldParcel);
        return ResponseEntity.ok(getFieldParcelDTO);
    }

    @DeleteMapping("/delete")
    public void deleteCropFieldById(@RequestParam(name = "id") UUID fieldParcelId) {
        fieldParcelService.deleteById(fieldParcelId);
    }
}
