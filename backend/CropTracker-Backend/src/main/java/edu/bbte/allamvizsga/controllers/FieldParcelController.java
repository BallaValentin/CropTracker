package edu.bbte.allamvizsga.controllers;

import edu.bbte.allamvizsga.dto.request.fieldParcel.CreateFieldParcelDTO;
import edu.bbte.allamvizsga.dto.request.fieldParcel.UpdateFieldParcelDTO;
import edu.bbte.allamvizsga.dto.response.cropfield.ConfirmUpdateDTO;
import edu.bbte.allamvizsga.dto.response.fieldParcel.GetFieldParcelDTO;
import edu.bbte.allamvizsga.exceptions.BadRequestException;
import edu.bbte.allamvizsga.mappers.FieldParcelMapper;
import edu.bbte.allamvizsga.mappers.FieldParcelVersionMapper;
import edu.bbte.allamvizsga.model.*;
import edu.bbte.allamvizsga.services.*;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/api/field-parcel")
@CrossOrigin(value = "http://localhost:5174")
@AllArgsConstructor(onConstructor = @__(@Autowired))
@PreAuthorize("hasRole('GROWER')")
public class FieldParcelController {
    private final UserService userService;
    private final CropFieldService cropFieldService;
    private final FieldParcelService fieldParcelService;
    private final FieldWorkService fieldWorkService;
    private final CropCultivarService cropCultivarService;
    private final FieldParcelMapper fieldParcelMapper;
    private final FieldParcelVersionMapper fieldParcelVersionMapper;

    protected ConfirmUpdateDTO getConfirmUpdate(CropFieldVersion cropFieldVersion) {
        int ongoingWorks = fieldWorkService.findAllOngoing(cropFieldVersion).size();
        int scheduledWorks = fieldWorkService.findAllScheduled(cropFieldVersion).size();

        if (ongoingWorks > 0 || scheduledWorks > 0) {
            return new ConfirmUpdateDTO(ongoingWorks, scheduledWorks);
        }

        return null;
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> createFieldParcel(@Valid @RequestBody CreateFieldParcelDTO createFieldParcelDTO,
                                               @RequestParam(name = "confirm", required = false) Boolean confirm,
                                               @RequestHeader("Authorization") String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);

        CropFieldVersion cropFieldVersion = cropFieldService.findById(
                createFieldParcelDTO.getCropFieldId(), user);

        CropCultivar cropCultivar = cropCultivarService.findByID(createFieldParcelDTO.getCropCultivarId());

        FieldParcel fieldParcel = fieldParcelMapper.createFieldParcelToModel(createFieldParcelDTO);
        FieldParcelVersion fieldParcelVersion = fieldParcelVersionMapper.createFieldParcelToModel(createFieldParcelDTO);
        fieldParcel.setCropField(cropFieldVersion.getCropField());
        fieldParcelVersion.setCropCultivar(cropCultivar);

        ConfirmUpdateDTO confirmUpdateDTO = getConfirmUpdate(cropFieldVersion);

        if (confirmUpdateDTO == null) {
            fieldParcelService.createFieldParcel(fieldParcel, fieldParcelVersion);
            return ResponseEntity.ok(null);
        }

        if (confirm) {
            FieldParcelVersion newFieldParcelVersion = fieldParcelService.createFieldParcel(fieldParcel, fieldParcelVersion);
            CropFieldVersion newVersion = newFieldParcelVersion.getCropFieldVersion();

            List<FieldWork> scheduledWorks = fieldWorkService.findAllScheduled(cropFieldVersion);

            if (!scheduledWorks.isEmpty()) {
                scheduledWorks.forEach(fieldWork -> {
                    int newNumberOfRows = ((Number) fieldParcelVersion.getLayoutParameters().get("numberOfRows")).intValue();

                    List<Boolean> newAffectedRows = new ArrayList<>(fieldWork.getAffectedRows());
                    newAffectedRows.addAll(Collections.nCopies(newNumberOfRows, Boolean.FALSE));

                    fieldWork.setCropFieldVersion(newVersion);

                    fieldWork.setAffectedRows(newAffectedRows);
                    fieldWorkService.updateScheduledWork(fieldWork);
                });
            }
            return ResponseEntity.ok(null);
        }

        return ResponseEntity.ok(confirmUpdateDTO);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateFieldParcel(@Valid @RequestBody UpdateFieldParcelDTO updateFieldParcelDTO,
                                               @RequestParam(name = "id") UUID fieldParcelId,
                                               @RequestParam(name = "confirm", required = false) Boolean confirm,
                                               @RequestHeader("Authorization") String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);

        CropFieldVersion cropFieldVersion = cropFieldService.findById(updateFieldParcelDTO.getCropFieldId(), user);

        CropCultivar cropCultivar = cropCultivarService.findByID(updateFieldParcelDTO.getCropCultivarId());

        FieldParcelVersion parcelUpdates = fieldParcelVersionMapper.updateFieldParcelDTOtoModel(updateFieldParcelDTO);
        parcelUpdates.setCropCultivar(cropCultivar);


        ConfirmUpdateDTO confirmUpdateDTO = getConfirmUpdate(cropFieldVersion);

        if (confirmUpdateDTO == null) {
            fieldParcelService.updateFieldParcel(fieldParcelId, parcelUpdates);
            return ResponseEntity.ok(null);
        }

        if (confirm) {
            FieldParcelVersion newParcelVersion = fieldParcelService.updateFieldParcel(fieldParcelId, parcelUpdates);
            CropFieldVersion newVersion = newParcelVersion.getCropFieldVersion();

            List<FieldWork> scheduledWorks = fieldWorkService.findAllScheduled(cropFieldVersion);

            if (!scheduledWorks.isEmpty()) {
                Collection<FieldParcelVersion> fieldParcelVersions =
                        cropFieldVersion.getFieldParcelVersions()
                                .stream()
                                .sorted(Comparator.comparing(fieldParcelVersion -> fieldParcelVersion.getFieldParcel().getCreatedAt()))
                                .toList();

                scheduledWorks.forEach(fieldWork -> {

                    List<Boolean> oldAffectedRows = new ArrayList<>(fieldWork.getAffectedRows());
                    List<Boolean> newAffectedRows = new ArrayList<>();
                    AtomicInteger offset = new AtomicInteger();

                    fieldParcelVersions.forEach(fieldParcelVersion -> {
                        int numberOfRows = ((Number) fieldParcelVersion.getLayoutParameters().get("numberOfRows")).intValue();
                        if (!fieldParcelVersion.getFieldParcel().getUid().equals(fieldParcelId)) {
                            newAffectedRows.addAll(oldAffectedRows.stream().toList()
                                    .subList(offset.get(), offset.get() + numberOfRows));
                        } else {
                            int newNumberOfRows = ((Number) parcelUpdates.getLayoutParameters().get("numberOfRows")).intValue();
                            if (numberOfRows == newNumberOfRows) {
                                newAffectedRows.addAll(oldAffectedRows.subList(offset.get(), offset.get() + numberOfRows));
                            } else {
                                newAffectedRows.addAll(Collections.nCopies(newNumberOfRows, Boolean.FALSE));
                            }
                        }
                        offset.addAndGet(numberOfRows);
                    });

                    fieldWork.setCropFieldVersion(newVersion);

                    fieldWork.setAffectedRows(newAffectedRows);
                    fieldWorkService.updateScheduledWork(fieldWork);
                });
            }
            return ResponseEntity.ok(null);
        }

        return ResponseEntity.ok(confirmUpdateDTO);
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
    public ResponseEntity<?> deleteCropFieldById(@RequestParam(name = "id") UUID fieldParcelId,
                                                 @RequestParam(name = "confirm", required = false) Boolean confirm) {

        CropFieldVersion cropFieldVersion = cropFieldService.findByParcelId(fieldParcelId);

        ConfirmUpdateDTO confirmUpdateDTO = getConfirmUpdate(cropFieldVersion);

        if (confirmUpdateDTO == null) {
            fieldParcelService.deleteById(fieldParcelId);
            return ResponseEntity.ok(null);
        }

        if (confirm) {
            UUID cropFieldId = cropFieldVersion.getCropField().getUid();
            User user = cropFieldVersion.getCropField().getUser();

            CropFieldVersion oldVersion = cropFieldService.findById(cropFieldId, user);

            Collection<FieldParcelVersion> fieldParcelVersions = oldVersion
                    .getFieldParcelVersions()
                    .stream()
                    .sorted(Comparator.comparing(fieldParcelVersion -> fieldParcelVersion.getFieldParcel().getCreatedAt()))
                    .toList();

            List<FieldWork> scheduledWorks = fieldWorkService.findAllScheduled(oldVersion);

            fieldParcelService.deleteById(fieldParcelId);

            CropFieldVersion newVersion = cropFieldService.findById(cropFieldId, user);

            if (!scheduledWorks.isEmpty()) {
                scheduledWorks.forEach(fieldWork -> {

                    AtomicInteger offset = new AtomicInteger();
                    List<Boolean> oldAffectedRows = new ArrayList<>(fieldWork.getAffectedRows());
                    List<Boolean> newAffectedRows = new ArrayList<>();

                    fieldParcelVersions.forEach(fieldParcelVersion -> {
                        int numberOfRows = ((Number) fieldParcelVersion.getLayoutParameters().get("numberOfRows")).intValue();

                        if (!fieldParcelVersion.getFieldParcel().getUid().equals(fieldParcelId)) {
                            newAffectedRows.addAll(oldAffectedRows.subList(
                                    offset.get(), offset.get() + numberOfRows
                            ));
                        }

                        offset.addAndGet(numberOfRows);
                    });

                    fieldWork.setCropFieldVersion(newVersion);
                    fieldWork.setAffectedRows(newAffectedRows);
                    fieldWorkService.updateScheduledWork(fieldWork);

                });
            }

            return ResponseEntity.ok(null);
        }


        return ResponseEntity.ok(confirmUpdateDTO);
    }
}
