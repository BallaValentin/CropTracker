package edu.bbte.allamvizsga.services;

import edu.bbte.allamvizsga.exceptions.BadRequestException;
import edu.bbte.allamvizsga.exceptions.ForbiddenException;
import edu.bbte.allamvizsga.model.CropField;
import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.repository.CropFieldRepository;
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

@Slf4j
@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class CropFieldService {
    private final CropFieldRepository cropFieldRepository;
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
                                .and(CropFieldSpecification.notDeleted())
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

    public void createCropField(CropField cropField) {
        validatePolygon(cropField.getPolygonPoints());
        updateName(cropField);

        cropField.setIsDeleted(Boolean.FALSE);
        cropFieldRepository.save(cropField);
    }

    public CropField findCropFieldByUser(UUID uid, User user) {
        CropField cropField = cropFieldRepository.findByUid(uid);

        if (cropField == null) {
            throw new EntityNotFoundException("Crop field not found.");
        }

        if (cropField.getUser() != user ||
                cropField.getIsDeleted()) {
            throw new ForbiddenException("Crop field access denied.");
        }
        return cropField;
    }

    public void updateCropField(CropField cropField) {
        CropField foundCropField = findById(cropField.getUid());

        if (foundCropField == null) {
            throw new EntityNotFoundException("Crop field not found.");
        }

        if (foundCropField.getUser() != cropField.getUser() || foundCropField.getIsDeleted()) {
            throw new ForbiddenException("Crop field access denied.");
        }

        validatePolygon(cropField.getPolygonPoints());
        cropField.setIsDeleted(Boolean.FALSE);
        updateName(cropField);
        cropFieldRepository.save(cropField);
    }

    public Collection<CropField> getCropFields(User user) {
        return cropFieldRepository.findAll(
                Specification.allOf(CropFieldSpecification
                                .byUser(user))
                        .and(CropFieldSpecification.notDeleted()),
                Sort.by(Sort.Direction.DESC, "createdAt")

        );
    }

    public Collection<CropField> findByPattern(User user, String pattern) {
        return cropFieldRepository.findAll(Specification.allOf(
                CropFieldSpecification.byUser(user)
                        .and(CropFieldSpecification.withNamePattern(pattern))
        ));
    }

    public CropField findById(UUID uid) {
        CropField cropField = cropFieldRepository.findByUid(uid);
        if (cropField == null || cropField.getIsDeleted()) {
            throw new EntityNotFoundException("Crop field not found.");
        }
        return cropField;
    }

    public void deleteById(UUID uid) {
        cropFieldRepository.softDeleteById(uid);
    }
}
