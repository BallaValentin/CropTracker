package edu.bbte.allamvizsga.services;

import edu.bbte.allamvizsga.exceptions.ForbiddenException;
import edu.bbte.allamvizsga.model.CropField;
import edu.bbte.allamvizsga.model.FieldParcel;
import edu.bbte.allamvizsga.repository.FieldParcelRepository;
import edu.bbte.allamvizsga.specifications.FieldParcelSpecification;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.UUID;


@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class FieldParcelService {
    private final FieldParcelRepository fieldParcelRepository;

    public void createFieldParcel(FieldParcel fieldParcel) {
        fieldParcelRepository.save(fieldParcel);
    }

    public Collection<FieldParcel> getFieldParcels(CropField cropField) {
        return fieldParcelRepository.findAll(
                Specification.allOf(
                        FieldParcelSpecification.byCropField(cropField)
                )
        );
    }

    public FieldParcel findByID(UUID uid) {
        return fieldParcelRepository.findByUid(uid);
    }

    public FieldParcel findByCropField(CropField cropField, UUID uid) {
        FieldParcel fieldParcel = fieldParcelRepository.findByUid(uid);
        if (fieldParcel == null) {
            throw new EntityNotFoundException("Couldn`t find field parcel");
        }
        if (fieldParcel.getCropField() != cropField ||
        cropField.getIsDeleted()) {
            throw new ForbiddenException("Couldn't access this plot because you are not it's owner");
        }
        return fieldParcel;
    }

    public void updateFieldParcel(FieldParcel fieldParcel) {
        fieldParcelRepository.save(fieldParcel);
    }

    public void deleteById(UUID uid) {
        fieldParcelRepository.deleteById(uid);
    }
}
