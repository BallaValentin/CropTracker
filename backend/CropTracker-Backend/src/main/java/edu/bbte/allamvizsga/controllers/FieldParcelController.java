package edu.bbte.allamvizsga.controllers;

import edu.bbte.allamvizsga.dto.request.cropfield.UpdateCropFieldDTO;
import edu.bbte.allamvizsga.dto.request.fieldParcel.CreateFieldParcelDTO;
import edu.bbte.allamvizsga.dto.request.fieldParcel.UpdateFieldParcelDTO;
import edu.bbte.allamvizsga.dto.response.cropfield.GetCropFieldDTO;
import edu.bbte.allamvizsga.dto.response.fieldParcel.GetFieldParcelDTO;
import edu.bbte.allamvizsga.mappers.FieldParcelMapper;
import edu.bbte.allamvizsga.model.CropField;
import edu.bbte.allamvizsga.model.FieldParcel;
import edu.bbte.allamvizsga.model.User;
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

import java.util.Collection;
import java.util.UUID;

@RestController
@RequestMapping("/api/field-parcel")
@CrossOrigin(value = "http://localhost:5174")
@AllArgsConstructor(onConstructor = @__(@Autowired))
@PreAuthorize("hasRole('GROWER')")
public class FieldParcelController {
    private final UserService userService;
    private final CropFieldService cfService;
    private final FieldParcelService fpService;
    private final FieldParcelMapper fpMapper;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public void createFieldParcel(@Valid @RequestBody CreateFieldParcelDTO createFieldParcelDTO,
                                @RequestHeader("Authorization") String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);
        FieldParcel fieldParcel = fpMapper.createFieldParcelDTOtoModel(createFieldParcelDTO);
        CropField cropField = cfService.findCropFieldByUser(createFieldParcelDTO.getCropFieldId(), user);
        fieldParcel.setCropField(cropField);
        fpService.createFieldParcel(fieldParcel);
    }

    @PutMapping("/update")
    public void updateCropField(@Valid @RequestBody UpdateFieldParcelDTO updateFieldParcelDTO,
                                @RequestParam(name = "id") String fieldParcelID,
                                @RequestHeader("Authorization") String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);
        CropField cropField = cfService.findCropFieldByUser(updateFieldParcelDTO.getCropFieldId(), user);
        FieldParcel fieldParcel = fpService.findByCropField(cropField, UUID.fromString(fieldParcelID));
        fpMapper.updateModelFromUpdateFieldParcelDto(updateFieldParcelDTO, fieldParcel);
        fpService.updateFieldParcel(fieldParcel);
    }

    @GetMapping("/findall")
    public ResponseEntity<Collection<GetFieldParcelDTO>> getCropFields(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(name = "cropFieldId") String cropFieldId) {
        User user = userService.extractUser(authorizationHeader);
        CropField cropField = cfService.findCropFieldByUser(UUID.fromString(cropFieldId), user);
        Collection<FieldParcel> fieldParcels = fpService.getFieldParcels(cropField);

        Collection<GetFieldParcelDTO> getFieldParcelDTOS = fieldParcels.stream().map(fpMapper::modelToGetFieldParcelDTO).toList();
        return ResponseEntity.ok(getFieldParcelDTOS);
    }

    @GetMapping("/findby")
    public ResponseEntity<GetFieldParcelDTO> getCropFieldById(
            @RequestParam(name = "id") String fieldParcelId
    ) {
        FieldParcel fieldParcel = fpService.findByID(UUID.fromString(fieldParcelId));
        GetFieldParcelDTO getFieldParcelDTO = fpMapper.modelToGetFieldParcelDTO(fieldParcel);
        return ResponseEntity.ok(getFieldParcelDTO);
    }

    @DeleteMapping("/delete")
    public void deleteCropFieldById(@RequestParam(name = "id") String fieldParcelId) {
        fpService.deleteById(UUID.fromString(fieldParcelId));
    }
}
