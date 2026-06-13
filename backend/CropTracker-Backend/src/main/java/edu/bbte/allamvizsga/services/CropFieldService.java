package edu.bbte.allamvizsga.services;

import edu.bbte.allamvizsga.exceptions.ForbiddenException;
import edu.bbte.allamvizsga.model.CropField;
import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.repository.CropFieldRepository;
import edu.bbte.allamvizsga.services.util.SerialNumberGetter;
import edu.bbte.allamvizsga.specifications.CropFieldSpecification;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    protected Integer getNextNumber(User user, String originalName) {
        Collection<String> sameNamesList = cropFieldRepository.findAll(
                Specification.allOf(
                        CropFieldSpecification.byUser(user)
                                .and(CropFieldSpecification.withNamePattern(originalName))
                                .and(CropFieldSpecification.notDeleted())
                )
        ).stream().map(CropField::getName).toList();

        return snGetter.getNextNumber(sameNamesList);

    }

    public void createCropField(CropField cropField) {

        Integer count = getNextNumber(cropField.getUser(), cropField.getName());

        if (count > 1) {
            cropField.setName(cropField.getName() + "(" + count + ")");
        }

        cropField.setIsDeleted(Boolean.FALSE);
        cropFieldRepository.save(cropField);
    }

    public CropField findCropFieldByUser(UUID uid, User user) {
        CropField cropField = cropFieldRepository.findByUid(uid);

        if (cropField == null) {
            throw new EntityNotFoundException("Couldn't find plot with id");
        }

        if (cropField.getUser() != user ||
                cropField.getIsDeleted()) {
            throw new ForbiddenException("Couldn't access this plot because you are not it's owner");
        }
        return cropField;
    }

    public void updateCropField(CropField cropField) {
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

    public CropField findById(UUID uid) {
        CropField cropField = cropFieldRepository.findByUid(uid);
        if (cropField == null || cropField.getIsDeleted()) {
            throw new EntityNotFoundException("Couldn't find plot with id");
        }
        return cropField;
    }

    public void deleteById(UUID uid) {
        cropFieldRepository.softDeleteById(uid);
    }
}
