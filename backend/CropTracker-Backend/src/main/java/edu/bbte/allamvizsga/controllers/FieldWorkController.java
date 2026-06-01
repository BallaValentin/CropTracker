package edu.bbte.allamvizsga.controllers;

import edu.bbte.allamvizsga.dto.request.fieldWork.CreateFieldWorkDTO;
import edu.bbte.allamvizsga.mappers.FieldWorkMapper;
import edu.bbte.allamvizsga.model.CropField;
import edu.bbte.allamvizsga.model.FieldWork;
import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.model.WorkTypes;
import edu.bbte.allamvizsga.services.*;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/field-works")
@CrossOrigin(value = "http://localhost:5174")
@AllArgsConstructor(onConstructor = @__(@Autowired))
@PreAuthorize("hasRole('GROWER')")
@Slf4j
public class FieldWorkController {
    private final FieldWorkService fieldWorkService;
    private final UserService userService;
    private final CropFieldService cropFieldService;
    private final FieldParcelService fieldParcelService;
    private final WorkTypesService workTypesService;
    private final FieldWorkMapper fieldWorkMapper;

    @PostMapping("/create")
    public void create(@Valid @RequestBody CreateFieldWorkDTO createFieldWorkDTO,
                       @RequestHeader("Authorization") String authorizationHeader) {
        FieldWork fieldWork = fieldWorkMapper.createFieldWorkToModel(createFieldWorkDTO);

        User user = userService.extractUser(authorizationHeader);

        UUID cropFieldId = UUID.fromString(createFieldWorkDTO.getCropFieldId());
        CropField cropField = cropFieldService.findCropFieldByUser(cropFieldId, user);
        fieldWork.setCropField(cropField);

        fieldWork.getFieldParcelIds().forEach(parcelId -> fieldParcelService.findByCropFieldAndUid(cropField, parcelId));

        UUID workTypesId = UUID.fromString(createFieldWorkDTO.getWorkTypeId());
        WorkTypes workTypes = workTypesService.findByUser(user, workTypesId);
        fieldWork.setWorkTypes(workTypes);

        fieldWorkService.create(fieldWork);

    }
}
