package edu.bbte.allamvizsga.services;

import edu.bbte.allamvizsga.exceptions.BadRequestException;
import edu.bbte.allamvizsga.exceptions.ForbiddenException;
import edu.bbte.allamvizsga.model.CropField;
import edu.bbte.allamvizsga.model.FieldParcel;
import edu.bbte.allamvizsga.repository.FieldParcelRepository;
import edu.bbte.allamvizsga.specifications.FieldParcelSpecification;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.Polygon;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.UUID;


@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class FieldParcelService {
    private final FieldParcelRepository fieldParcelRepository;

    protected void polygonValidation(FieldParcel fieldParcel) {
        double precisionTolerance = 0.000001;
        double areaTolerance = 0.00000001;

        Polygon fieldParcelPolygon = fieldParcel.getPolygonPoints();
        Polygon cropFieldPolygon = (Polygon) fieldParcel.getCropField().getPolygonPoints().buffer(precisionTolerance);

        if (!cropFieldPolygon.covers(fieldParcelPolygon)) {
            throw new BadRequestException("Field parcel polygon must be inside crop field polygon");
        }

        Collection<FieldParcel> fieldParcels = fieldParcel.getCropField().getFieldParcels();

        for (FieldParcel parcel : fieldParcels) {
            if (parcel.getUid().equals(fieldParcel.getUid())) {
                continue;
            }

            if (parcel.getPolygonPoints().getEnvelopeInternal().intersects(
                    fieldParcel.getPolygonPoints().getEnvelopeInternal()
            )) {
                if (parcel.getPolygonPoints().overlaps(fieldParcel.getPolygonPoints())) {
                    Geometry intersection = parcel.getPolygonPoints().intersection(fieldParcel.getPolygonPoints());
                    if (intersection.getArea() > areaTolerance) {
                        throw new BadRequestException("Field parcel polygon shouldn`t intersect other polygon");
                    }
                }
            }
        }
    }

    public void createFieldParcel(FieldParcel fieldParcel) {
        polygonValidation(fieldParcel);
        fieldParcelRepository.save(fieldParcel);
    }

    public Collection<FieldParcel> getFieldParcels(CropField cropField) {
        return fieldParcelRepository.findAll(
                Specification.allOf(
                        FieldParcelSpecification.byCropField(cropField)
                ), Sort.by(Sort.Direction.ASC, "createdAt")
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

    public FieldParcel findByCropFieldAndUid(CropField cropField, UUID uid) {
        FieldParcel fieldParcel = fieldParcelRepository.findByUid(uid);

        if (fieldParcel == null) {
            throw new EntityNotFoundException("Couldn`t find filed parcel with id " + uid);
        }

        if (fieldParcel.getCropField() != cropField) {
            throw new ForbiddenException("You have no access to this field parcel");
        }

        return fieldParcel;
    }

    public void updateFieldParcel(FieldParcel fieldParcel) {
        if (fieldParcelRepository.findByUid(fieldParcel.getUid()) == null) {
            throw new EntityNotFoundException("Couldn`t find field parcel with id: " + fieldParcel.getUid());
        }
        polygonValidation(fieldParcel);
        fieldParcelRepository.save(fieldParcel);
    }

    public void deleteById(UUID uid) {
        if (fieldParcelRepository.findByUid(uid) == null) {
            throw new EntityNotFoundException("Couldn`t find field parcel with id: " + uid);
        }
        fieldParcelRepository.deleteById(uid);
    }
}
