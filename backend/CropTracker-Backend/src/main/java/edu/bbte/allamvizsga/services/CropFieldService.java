package edu.bbte.allamvizsga.services;

import edu.bbte.allamvizsga.exceptions.BadRequestException;
import edu.bbte.allamvizsga.exceptions.ForbiddenException;
import edu.bbte.allamvizsga.model.CropField;
import edu.bbte.allamvizsga.model.CropFieldVersion;
import edu.bbte.allamvizsga.model.FieldParcelVersion;
import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.repository.CropFieldRepository;
import edu.bbte.allamvizsga.repository.CropFieldVersionRepository;
import edu.bbte.allamvizsga.repository.FieldParcelVersionRepository;
import edu.bbte.allamvizsga.services.util.SerialNumberGetter;
import edu.bbte.allamvizsga.specifications.CropFieldSpecification;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Polygon;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class CropFieldService {
    private final CropFieldRepository cropFieldRepository;
    private final CropFieldVersionRepository cropFieldVersionRepository;
    private final FieldParcelVersionRepository fieldParcelVersionRepository;
    private final SerialNumberGetter snGetter;

    protected void validatePolygon(Polygon polygon) {
        if (!polygon.isValid()) {
            throw new BadRequestException("Invalid polygon shape.");
        }
    }

    protected Integer getNextNumber(User user, String originalName, UUID cropFieldId) {
        Collection<String> sameNamesList = cropFieldRepository.findAll(
                Specification.allOf(
                        CropFieldSpecification.byUser(user)
                                .and(CropFieldSpecification.withNamePattern(originalName))
                                .and(CropFieldSpecification.isActive())
                                .and(CropFieldSpecification.notWithId(cropFieldId))
                )
        ).stream().map(CropField::getName).toList();

        return snGetter.getNextNumber(sameNamesList);
    }

    protected void updateName(CropField cropField) {
        Integer count = getNextNumber(cropField.getUser(), cropField.getName(), cropField.getUid());

        if (count > 1) {
            cropField.setName(cropField.getName() + "(" + count + ")");
        }
    }

    public void createCropField(CropField cropField, CropFieldVersion cropFieldVersion) {
        validatePolygon(cropFieldVersion.getPolygonPoints());
        updateName(cropField);

        CropField newCropField = cropFieldRepository.save(cropField);
        cropFieldVersion.setCropField(newCropField);
        cropFieldVersionRepository.save(cropFieldVersion);
    }

    public CropField findCropFieldByUser(UUID uid, User user) {
        CropFieldVersion cropFieldVersion = cropFieldVersionRepository.findByUid(uid);

        if (cropFieldVersion == null || !cropFieldVersion.getCropField().getIsActive()) {
            throw new EntityNotFoundException("Crop field not found.");
        }

        if (cropFieldVersion.getCropField().getUser() != user) {
            throw new ForbiddenException("Crop field access denied.");
        }

        return cropFieldVersion.getCropField();
    }

    public void updateCropField(UUID cropFieldId, String newName, User user, CropFieldVersion cropFieldVersion) {
        CropField cropField = cropFieldRepository.findByUid(cropFieldId);

        if (cropField == null || !cropField.getIsActive()) {
            throw new EntityNotFoundException("Crop field not found");
        }

        CropFieldVersion cropFieldVersion1 = cropFieldVersionRepository.findFirstByCropFieldOrderByCreatedAtDesc(cropField);

        if (cropFieldVersion1 == null) {
            throw new EntityNotFoundException("Crop field not found.");
        }

        if (cropFieldVersion1.getCropField().getUser() != user) {
            throw new ForbiddenException("Crop field access denied.");
        }

        validatePolygon(cropFieldVersion.getPolygonPoints());
        CropField currentCropField = cropFieldVersion1.getCropField();

        if (!newName.equals(currentCropField.getName())) {
            currentCropField.setName(newName);
            updateName(currentCropField);
        }

        CropField updatedCropField = cropFieldRepository.save(currentCropField);

        cropFieldVersion.setCropField(updatedCropField);
        CropFieldVersion newCropFieldVersion = cropFieldVersionRepository.save(cropFieldVersion);

        Collection<FieldParcelVersion> fieldParcelVersions = cropFieldVersion.getFieldParcelVersions();

        fieldParcelVersions.forEach(fieldParcelVersion -> {
            FieldParcelVersion newFieldParcelVersion = fieldParcelVersion.createClone();
            newFieldParcelVersion.setCropFieldVersion(newCropFieldVersion);
            fieldParcelVersionRepository.save(newFieldParcelVersion);
        });
    }

    public Collection<CropField> getCropFields(User user) {
        return cropFieldRepository.findAll(
                Specification.allOf(CropFieldSpecification
                                .byUser(user))
                        .and(CropFieldSpecification.isActive()),
                Sort.by(Sort.Direction.DESC, "createdAt")

        );
    }

    public Collection<CropFieldVersion> getCropFieldVersions(User user) {
        Collection<CropField> cropFields = getCropFields(user);

        return cropFields.stream().map(cropFieldVersionRepository::findFirstByCropFieldOrderByCreatedAtDesc).toList();
    }

    public Collection<CropField> findByPattern(User user, String pattern) {
        return cropFieldRepository.findAll(Specification.allOf(
                CropFieldSpecification.byUser(user)
                        .and(CropFieldSpecification.withNamePattern(pattern))
        ));
    }

    public CropFieldVersion findById(UUID uid, User user) {
        CropField cropField = cropFieldRepository.findByUid(uid);
        CropFieldVersion cropFieldVersion = cropFieldVersionRepository.findFirstByCropFieldOrderByCreatedAtDesc(cropField);

        if (cropFieldVersion == null || !cropFieldVersion.getCropField().getIsActive()) {
            throw new EntityNotFoundException("Crop field not found.");
        }

        if (cropField.getUser() != user) {
            throw new ForbiddenException("Crop field access denied");
        }

        return cropFieldVersion;
    }

    public CropFieldVersion findByVersionId(UUID uid, User user) {
        CropFieldVersion cropFieldVersion = cropFieldVersionRepository.findByUid(uid);

        if (cropFieldVersion == null || !cropFieldVersion.getCropField().getIsActive()) {
            throw new EntityNotFoundException("Crop field not found.");
        }

        if (cropFieldVersion.getCropField().getUser() != user) {
            throw new ForbiddenException("Crop field denied access denied.");
        }

        return cropFieldVersion;
    }

    public void deleteById(UUID uid, User user) {
        CropField cropField = cropFieldRepository.findByUid(uid);

        if (cropField == null || !cropField.getIsActive()) {
            throw new EntityNotFoundException("Crop field not found");
        }

        if (cropField.getUser() != user) {
            throw new ForbiddenException("Crop field access denied");
        }

        cropField.setIsActive(Boolean.FALSE);
        cropFieldRepository.save(cropField);
    }
}
