package edu.bbte.allamvizsga.controllers;

import edu.bbte.allamvizsga.dto.request.fieldWork.CreateFieldWorkDTO;
import edu.bbte.allamvizsga.dto.request.fieldWork.UpdateFieldWorkDTO;
import edu.bbte.allamvizsga.dto.response.fieldWork.GetFieldWorkDTO;
import edu.bbte.allamvizsga.dto.response.fieldWork.GetAffectedRowsDTO;
import edu.bbte.allamvizsga.mappers.FieldWorkMapper;
import edu.bbte.allamvizsga.model.CropField;
import edu.bbte.allamvizsga.model.FieldWork;
import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.model.WorkType;
import edu.bbte.allamvizsga.services.*;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

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
    private final WorkTypeService workTypesService;
    private final FieldWorkMapper fieldWorkMapper;

    protected void setupFieldWork(FieldWork fieldWork, String authorizationHeader, String fieldId, String workId) {
        User user = userService.extractUser(authorizationHeader);

        UUID cropFieldId = UUID.fromString(fieldId);
        CropField cropField = cropFieldService.findCropFieldByUser(cropFieldId, user);
        fieldWork.setCropField(cropField);

        fieldWork.getFieldParcelIds().forEach(parcelId -> fieldParcelService.findByCropFieldAndUid(cropField, parcelId));

        UUID workTypesId = UUID.fromString(workId);
        WorkType workType = workTypesService.findByUser(user, workTypesId);
        fieldWork.setWorkType(workType);
    }

    @PostMapping("/create")
    public void create(@Valid @RequestBody CreateFieldWorkDTO createFieldWorkDTO,
                       @RequestHeader("Authorization") String authorizationHeader) {
        FieldWork fieldWork = fieldWorkMapper.createFieldWorkToModel(createFieldWorkDTO);

        setupFieldWork(fieldWork, authorizationHeader, createFieldWorkDTO.getCropFieldId(), createFieldWorkDTO.getWorkTypeId());

        fieldWorkService.create(fieldWork);
    }

    @PutMapping("/update")
    public void update(@Valid @RequestBody UpdateFieldWorkDTO updateFieldWorkDTO,
                       @RequestParam("fieldWorkId") String workId,
                       @RequestHeader("Authorization") String authorizationHeader) {
        FieldWork fieldWork = fieldWorkMapper.updateFieldWorkToModel(updateFieldWorkDTO);
        UUID fieldWorkId = UUID.fromString(workId);
        fieldWork.setUid(fieldWorkId);

        setupFieldWork(fieldWork, authorizationHeader, updateFieldWorkDTO.getCropFieldId(), updateFieldWorkDTO.getWorkTypeId());

        fieldWorkService.update(fieldWork);
    }

    @GetMapping("/findall")
    public ResponseEntity<Collection<GetFieldWorkDTO>> findAll(@RequestHeader("Authorization")
                                                               String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);

        Collection<FieldWork> fieldWorks = fieldWorkService.findall(user);

        return ResponseEntity.ok(fieldWorks.stream().map(fieldWorkMapper::modelToGetFieldWork).toList());
    }

    @GetMapping(value = "/findall", params = "cropFieldId")
    public ResponseEntity<Collection<GetFieldWorkDTO>> findAllOfCropField(@RequestHeader("Authorization")
                                                                          String authorizationHeader,
                                                                          @RequestParam("cropFieldId") String fieldId) {
        User user = userService.extractUser(authorizationHeader);
        UUID cropFieldId = UUID.fromString(fieldId);
        CropField cropField = cropFieldService.findCropFieldByUser(cropFieldId, user);

        Collection<FieldWork> fieldWorks = fieldWorkService.findallByCropField(cropField);

        return ResponseEntity.ok(fieldWorks.stream().map(fieldWorkMapper::modelToGetFieldWork).toList());
    }

    @GetMapping("/findby")
    public ResponseEntity<GetFieldWorkDTO> findById(@RequestHeader("Authorization")
                                                    String authorizationHeader, @RequestParam("id") String id) {
        User user = userService.extractUser(authorizationHeader);
        UUID fieldWorkId = UUID.fromString(id);

        FieldWork fieldWork = fieldWorkService.findById(fieldWorkId, user);

        return ResponseEntity.ok(fieldWorkMapper.modelToGetFieldWork(fieldWork));
    }

    @GetMapping("/findRows")
    public ResponseEntity<GetAffectedRowsDTO> findPreviousAffectedRows(@RequestHeader("Authorization") String authorizationHeader,
                                                                       @RequestParam("cropFieldId") String id,
                                                                       @RequestParam("numberOfDays") Integer numberOfDays,
                                                                       @RequestParam("referenceDate") String refDateString,
                                                                       @RequestParam("workTypes") List<String> selectedWorkTypes) {
        User user = userService.extractUser(authorizationHeader);
        UUID cropFieldId = UUID.fromString(id);

        CropField cropField = cropFieldService.findCropFieldByUser(cropFieldId, user);
        Instant refDate = Instant.parse(refDateString);

        List<UUID> selectedWorkTypeIds = selectedWorkTypes.stream().map(UUID::fromString).toList();

        List<FieldWork> previousFieldWorks = fieldWorkService.findAllWithinPastDays(
                cropField, refDate, numberOfDays, selectedWorkTypeIds);
        GetAffectedRowsDTO affectedRowsDTO = new GetAffectedRowsDTO(Collections.emptyList());

        if (!previousFieldWorks.isEmpty()) {
            List<Boolean> masterRows = new ArrayList<>(previousFieldWorks.getFirst().getAffectedRows().stream().toList());

            previousFieldWorks.forEach(fieldWork -> {
                List<Boolean> rows = fieldWork.getAffectedRows().stream().toList();
                for (int i = 0; i < fieldWork.getAffectedRows().size(); i++) {
                    masterRows.set(i, masterRows.get(i) | rows.get(i));
                }
            });

            affectedRowsDTO.setAffectedRows(masterRows);
        }

        return ResponseEntity.ok(affectedRowsDTO);
    }
}
