package edu.bbte.allamvizsga.controllers;

import edu.bbte.allamvizsga.dto.request.fieldWork.CreateFieldWorkDTO;
import edu.bbte.allamvizsga.dto.request.fieldWork.UpdateFieldWorkDTO;
import edu.bbte.allamvizsga.dto.response.fieldWork.GetFieldWorkDTO;
import edu.bbte.allamvizsga.dto.response.fieldWork.GetPreviousWorkDTO;
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
import org.springframework.data.domain.Page;
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

    protected void setupFieldWork(FieldWork fieldWork, String authorizationHeader,
            UUID cropFieldId, UUID workTypeId) {
        User user = userService.extractUser(authorizationHeader);

        CropField cropField = cropFieldService.findCropFieldByUser(cropFieldId, user);
        fieldWork.setCropField(cropField);

        fieldWork.getFieldParcelIds().forEach(parcelId -> fieldParcelService.findByCropFieldAndUid(cropField, parcelId));

        WorkType workType = workTypesService.findByUser(user, workTypeId);
        fieldWork.setWorkType(workType);

        fieldWork.setIsActive(Boolean.TRUE);
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
                       @RequestParam("fieldWorkId") UUID fieldWorkId,
                       @RequestHeader("Authorization") String authorizationHeader) {
        FieldWork fieldWork = fieldWorkMapper.updateFieldWorkToModel(updateFieldWorkDTO);
        fieldWork.setUid(fieldWorkId);

        setupFieldWork(fieldWork, authorizationHeader, updateFieldWorkDTO.getCropFieldId(), updateFieldWorkDTO.getWorkTypeId());

        fieldWorkService.update(fieldWork);
    }

    @GetMapping(value = "/find-by-page")
    public ResponseEntity<Collection<GetPreviousWorkDTO>> findAll(@RequestHeader("Authorization")
                                                               String authorizationHeader,
                                                                  @RequestParam("page") int page,
                                                                  @RequestParam("size") int size,
                                                                  @RequestParam(name = "cropFieldId", required = false) UUID cropFieldId,
                                                                  @RequestParam(name = "workTypeId", required = false) UUID workTypeId) {
        System.out.println("Page: " + page + " size: " + size);
        User user = userService.extractUser(authorizationHeader);

        WorkType workType = null;

        if (workTypeId != null) {
            workType = workTypesService.findByUser(user, workTypeId);
        }

        CropField cropField = null;

        if (cropFieldId != null) {
            cropField = cropFieldService.findCropFieldByUser(cropFieldId, user);
        }

        Page<FieldWork> fieldWorks = fieldWorkService.findAllPastWorks(user, workType, cropField, page, size);

        return ResponseEntity.ok(fieldWorks.stream().map(fieldWorkMapper::modelToGetPreviousWork).toList());
    }



    @GetMapping(value = "/findall", params = "cropFieldId")
    public ResponseEntity<Collection<GetFieldWorkDTO>> findAllOfCropField(@RequestHeader("Authorization")
                                                                          String authorizationHeader,
                                                                          @RequestParam("cropFieldId") UUID cropFieldId) {
        User user = userService.extractUser(authorizationHeader);
        CropField cropField = cropFieldService.findCropFieldByUser(cropFieldId, user);

        Collection<FieldWork> fieldWorks = fieldWorkService.findAllByCropField(cropField);

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
                                                                       @RequestParam("workTypes") List<String> selectedWorkTypes) {
        User user = userService.extractUser(authorizationHeader);

        CropField cropField = cropFieldService.findCropFieldByUser(cropFieldId, user);
        Instant refDate = Instant.parse(refDateString);

        List<UUID> selectedWorkTypeIds = selectedWorkTypes.stream().map(UUID::fromString).toList();

        List<FieldWork> previousFieldWorks = fieldWorkService.findAllWithinPastDays(
                cropField, refDate, numberOfDays, selectedWorkTypeIds);

        return ResponseEntity.ok(previousFieldWorks.stream().map(fieldWorkMapper::modelToGetPreviousWork).toList());
    }

    @DeleteMapping("/delete")
    public void deleteAll(@RequestHeader("Authorization") String authorizationHeader,
                       @RequestParam("fieldWorkIds") List<UUID> fieldWorkIds) {

        User user = userService.extractUser(authorizationHeader);
        fieldWorkService.deleteAll(user, fieldWorkIds);
    }
}
