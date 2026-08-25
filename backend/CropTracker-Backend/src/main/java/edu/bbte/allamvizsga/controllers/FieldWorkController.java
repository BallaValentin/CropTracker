package edu.bbte.allamvizsga.controllers;

import edu.bbte.allamvizsga.dto.request.fieldWork.CreateFieldWorkDTO;
import edu.bbte.allamvizsga.dto.request.fieldWork.UpdateFieldWorkDTO;
import edu.bbte.allamvizsga.dto.response.fieldWork.GetFieldWorkDTO;
import edu.bbte.allamvizsga.dto.response.fieldWork.GetPreviousWorkDTO;
import edu.bbte.allamvizsga.dto.response.fieldWork.GetWorkStatDTO;
import edu.bbte.allamvizsga.mappers.FieldWorkMapper;
import edu.bbte.allamvizsga.model.*;
import edu.bbte.allamvizsga.services.*;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
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
    private final WorkTypeService workTypesService;
    private final FieldWorkMapper fieldWorkMapper;

    protected void setupFieldWorkForCreate(FieldWork fieldWork, String authorizationHeader,
                                           UUID cropFieldId, UUID workTypeId) {
        User user = userService.extractUser(authorizationHeader);

        CropFieldVersion cropFieldVersion = cropFieldService.findById(cropFieldId, user);
        fieldWork.setCropFieldVersion(cropFieldVersion);

        WorkType workType = workTypesService.findByUser(user, workTypeId);
        fieldWork.setWorkType(workType);

        fieldWork.setIsActive(Boolean.TRUE);
    }

    protected void setupFieldWorkForUpdate(FieldWork fieldWork, String authorizationHeader,
                                           UUID cropFieldId, UUID workTypeId) {
        User user = userService.extractUser(authorizationHeader);

        CropFieldVersion cropFieldVersion = cropFieldService.findByVersionId(cropFieldId, user);
        fieldWork.setCropFieldVersion(cropFieldVersion);

        WorkType workType = workTypesService.findByUser(user, workTypeId);
        fieldWork.setWorkType(workType);

        fieldWork.setIsActive(Boolean.TRUE);
    }

    @PostMapping("/create")
    public void create(@Valid @RequestBody CreateFieldWorkDTO createFieldWorkDTO,
                       @RequestHeader("Authorization") String authorizationHeader) {
        System.out.println("Received create field work request");
        FieldWork fieldWork = fieldWorkMapper.createFieldWorkToModel(createFieldWorkDTO);

        setupFieldWorkForCreate(fieldWork, authorizationHeader, createFieldWorkDTO.getCropFieldId(), createFieldWorkDTO.getWorkTypeId());

        fieldWorkService.create(fieldWork);
    }

    @PutMapping("/update")
    public void update(@Valid @RequestBody UpdateFieldWorkDTO updateFieldWorkDTO,
                       @RequestParam("fieldWorkId") UUID fieldWorkId,
                       @RequestHeader("Authorization") String authorizationHeader) {

        FieldWork fieldWork = fieldWorkMapper.updateFieldWorkToModel(updateFieldWorkDTO);
        fieldWork.setUid(fieldWorkId);

        setupFieldWorkForUpdate(fieldWork, authorizationHeader, updateFieldWorkDTO.getCropFieldId(), updateFieldWorkDTO.getWorkTypeId());

        fieldWorkService.update(fieldWork);
    }

    @GetMapping(value = "/find-by-page")
    public ResponseEntity<Collection<GetPreviousWorkDTO>> findAll(@RequestHeader("Authorization")
                                                                  String authorizationHeader,
                                                                  @RequestParam(name = "lastSeen", required = false) UUID lastSeen,
                                                                  @RequestParam("size") int size,
                                                                  @RequestParam(name = "cropFieldIds", required = false) List<UUID> cropFieldIds,
                                                                  @RequestParam(name = "workTypeIds", required = false) List<UUID> workTypeIds) {

        User user = userService.extractUser(authorizationHeader);

        Collection<WorkType> workTypes = new ArrayList<>();

        if (!workTypeIds.isEmpty()) {
            workTypeIds.forEach(workTypeId -> {
                WorkType workType = workTypesService.findByUser(user, workTypeId);
                workTypes.add(workType);
            });
        }

        Collection<CropField> cropFields = new ArrayList<>();

        if (!cropFieldIds.isEmpty()) {
            cropFieldIds.forEach(cropFieldId -> {
                CropField cropField = cropFieldService.findCropFieldByUser(cropFieldId, user);
                cropFields.add(cropField);
            });
        }

        List<FieldWork> fieldWorks = fieldWorkService.findAllPastWorks(user, workTypes, cropFields, lastSeen, size);

        return ResponseEntity.ok(fieldWorks.stream().map(fieldWorkMapper::modelToGetPreviousWork).toList());
    }

    @GetMapping("/findall-by-day")
    public Collection<GetPreviousWorkDTO> findAllByDay(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam("userDateTime") OffsetDateTime userDateTime
    ) {
        User user = userService.extractUser(authorizationHeader);
        Collection<FieldWork> fieldWorks = fieldWorkService.findAllByDay(user, userDateTime);

        return fieldWorks.stream().map(fieldWorkMapper::modelToGetPreviousWork).toList();
    }


    @GetMapping(value = "/findall", params = "cropFieldId")
    public ResponseEntity<Collection<GetFieldWorkDTO>> findAllOfCropField(@RequestHeader("Authorization")
                                                                          String authorizationHeader,
                                                                          @RequestParam("cropFieldId") UUID cropFieldId) {
        User user = userService.extractUser(authorizationHeader);
        CropFieldVersion cropFieldVersion = cropFieldService.findById(cropFieldId, user);

        Collection<FieldWork> fieldWorks = fieldWorkService.findAllByCropField(cropFieldVersion.getCropField());

        return ResponseEntity.ok(fieldWorks.stream().map(fieldWorkMapper::modelToGetFieldWork).toList());
    }

    @GetMapping("/findby")
    public ResponseEntity<GetFieldWorkDTO> findById(@RequestHeader("Authorization")
                                                    String authorizationHeader, @RequestParam("id") UUID fieldWorkId) {
        User user = userService.extractUser(authorizationHeader);

        FieldWork fieldWork = fieldWorkService.findById(fieldWorkId, user);

        return ResponseEntity.ok(fieldWorkMapper.modelToGetFieldWork(fieldWork));
    }

    @GetMapping("/find-previous-works")
    public ResponseEntity<Collection<GetPreviousWorkDTO>> findPreviousWorks(@RequestHeader("Authorization") String authorizationHeader,
                                                                            @RequestParam("cropFieldId") UUID cropFieldId,
                                                                            @RequestParam("numberOfDays") Integer numberOfDays,
                                                                            @RequestParam("referenceDate") String refDateString,
                                                                            @RequestParam("workTypes") List<UUID> selectedWorkTypeIds) {
        User user = userService.extractUser(authorizationHeader);

        CropFieldVersion cropFieldVersion = cropFieldService.findById(cropFieldId, user);
        OffsetDateTime refDate = OffsetDateTime.parse(refDateString);

        List<FieldWork> previousFieldWorks = fieldWorkService.findAllWithinPastDays(
                cropFieldVersion, refDate, numberOfDays, selectedWorkTypeIds);

        return ResponseEntity.ok(previousFieldWorks.stream().map(fieldWorkMapper::modelToGetPreviousWork).toList());
    }

    @GetMapping("/get-work-stats")
    public ResponseEntity<Collection<GetWorkStatDTO>> getWorkStats(@RequestHeader("Authorization")
                                                                   String authorizationHeader,
                                                                   @RequestParam("numberOfDays") int numberOfDays) {
        User user = userService.extractUser(authorizationHeader);

        Collection<FieldWork> fieldWorks = fieldWorkService.findAllWithinDays(user, numberOfDays);

        return ResponseEntity.ok(fieldWorks.stream().map(fieldWorkMapper::modelToGetWorkStat).toList());
    }

    @DeleteMapping("/delete")
    public void deleteAll(@RequestHeader("Authorization") String authorizationHeader,
                          @RequestParam("fieldWorkIds") List<UUID> fieldWorkIds) {

        User user = userService.extractUser(authorizationHeader);
        fieldWorkService.deleteAll(user, fieldWorkIds);
    }
}
