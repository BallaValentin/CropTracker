package edu.bbte.allamvizsga.services;

import edu.bbte.allamvizsga.exceptions.BadRequestException;
import edu.bbte.allamvizsga.exceptions.ForbiddenException;
import edu.bbte.allamvizsga.model.*;
import edu.bbte.allamvizsga.repository.CropFieldVersionRepository;
import edu.bbte.allamvizsga.repository.FieldParcelRepository;
import edu.bbte.allamvizsga.repository.FieldParcelVersionRepository;
import edu.bbte.allamvizsga.specifications.FieldParcelVersionSpecification;
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
    private final CropFieldVersionRepository cropFieldVersionRepository;
    private final FieldParcelVersionRepository fieldParcelVersionRepository;

    protected void polygonValidation(FieldParcelVersion fieldParcelVersion,
                                     CropFieldVersion cropFieldVersion) {
        if (!fieldParcelVersion.getPolygonPoints().isValid()) {
            throw new BadRequestException("Invalid polygon shape.");
        }

        double precisionTolerance = 0.000001;
        double areaTolerance = 0.00000001;

        Polygon fieldParcelPolygon = fieldParcelVersion.getPolygonPoints();
        Polygon cropFieldPolygon = (Polygon) cropFieldVersion.getPolygonPoints().buffer(precisionTolerance);

        if (!cropFieldPolygon.covers(fieldParcelPolygon)) {
            throw new BadRequestException("Field parcel polygon must be fully inside crop field polygon.");
        }

        Collection<FieldParcelVersion> fieldParcelVersions = cropFieldVersion.getFieldParcelVersions();

        for (FieldParcelVersion parcel : fieldParcelVersions) {
            if (parcel.getUid().equals(fieldParcelVersion.getUid())) {
                continue;
            }

            if (parcel.getPolygonPoints().getEnvelopeInternal().intersects(
                    fieldParcelVersion.getPolygonPoints().getEnvelopeInternal()
            )) {
                if (parcel.getPolygonPoints().overlaps(fieldParcelVersion.getPolygonPoints())) {
                    Geometry intersection = parcel.getPolygonPoints().intersection(fieldParcelVersion.getPolygonPoints());
                    if (intersection.getArea() > areaTolerance) {
                        throw new BadRequestException("No field parcel polygon intersections allowed.");
                    }
                }
            }
        }
    }

    public void createFieldParcel(FieldParcel fieldParcel, FieldParcelVersion fieldParcelVersion) {
        CropFieldVersion currentCropFieldVersion = cropFieldVersionRepository.findFirstByCropFieldOrderByCreatedAtDesc(fieldParcel.getCropField());
        polygonValidation(fieldParcelVersion, currentCropFieldVersion);
        FieldParcel newFieldParcel = fieldParcelRepository.save(fieldParcel);

        CropFieldVersion versionUpdates = currentCropFieldVersion.createClone();
        CropFieldVersion newCropFieldVersion = cropFieldVersionRepository.save(versionUpdates);

        currentCropFieldVersion.getFieldParcelVersions().forEach(fieldParcelVersion1 -> {
            FieldParcelVersion newFieldParcelVersion = fieldParcelVersion1.createClone();
            newFieldParcelVersion.setCropFieldVersion(newCropFieldVersion);
            fieldParcelVersionRepository.save(newFieldParcelVersion);
        });

        fieldParcelVersion.setCropFieldVersion(newCropFieldVersion);
        fieldParcelVersion.setFieldParcel(newFieldParcel);
        fieldParcelVersionRepository.save(fieldParcelVersion);

    }

    public Collection<FieldParcelVersion> getFieldParcels(CropFieldVersion cropFieldVersion) {
        return fieldParcelVersionRepository.findAll(
                Specification.allOf(
                        FieldParcelVersionSpecification.byCropFieldVersion(cropFieldVersion)
                ), Sort.by(Sort.Direction.ASC, "createdAt")
        );
    }

    public FieldParcelVersion findByID(UUID uid, User user) {
        FieldParcel fieldParcel = fieldParcelRepository.findByUid(uid);

        if (fieldParcel == null || !fieldParcel.getIsActive()) {
            throw new EntityNotFoundException("Field parcel not found");
        }

        FieldParcelVersion fieldParcelVersion = fieldParcelVersionRepository.findByFieldParcelOrderByCreatedAtDesc(fieldParcel);

        if (fieldParcelVersion == null) {
            throw new EntityNotFoundException("Field parcel not found.");
        }

        if (fieldParcelVersion.getFieldParcel().getCropField().getUser() != user) {
            throw new ForbiddenException("Access denied to field parcel.");
        }

        return fieldParcelVersion;
    }

    public void findByCropFieldAndUid(CropField cropField, UUID uid) {
        FieldParcelVersion fieldParcelVersion = fieldParcelVersionRepository.findByUid(uid);

        if (fieldParcelVersion == null || !fieldParcelVersion.getFieldParcel().getIsActive()) {
            throw new EntityNotFoundException("Field parcel not found.");
        }

        if (fieldParcelVersion.getFieldParcel().getCropField() != cropField) {
            throw new ForbiddenException("Access denied to field parcel.");
        }
    }

    public void updateFieldParcel(UUID fieldParcelId, FieldParcelVersion fieldParcelUpdate) {
        FieldParcel fieldParcel = fieldParcelRepository.findByUid(fieldParcelId);

        if (fieldParcel == null || !fieldParcel.getIsActive()) {
            throw new EntityNotFoundException("Field parcel not found");
        }

        CropFieldVersion currentCropFieldVersion = fieldParcelUpdate.getCropFieldVersion();
        polygonValidation(fieldParcelUpdate, currentCropFieldVersion);

        CropFieldVersion versionUpdates = currentCropFieldVersion.createClone();
        CropFieldVersion newCropFieldVersion = cropFieldVersionRepository.save(versionUpdates);

        Collection<FieldParcelVersion> fieldParcelVersions = currentCropFieldVersion.getFieldParcelVersions();
        fieldParcelVersions.forEach(fieldParcelVersion1 -> {
            if (!fieldParcelVersion1.getUid().equals(fieldParcelUpdate.getUid())) {
                FieldParcelVersion newFieldParcelVersion = fieldParcelVersion1.createClone();
                newFieldParcelVersion.setCropFieldVersion(newCropFieldVersion);
                fieldParcelVersionRepository.save(newFieldParcelVersion);
            }
        });

        fieldParcelUpdate.setCropFieldVersion(newCropFieldVersion);
        fieldParcelVersionRepository.save(fieldParcelUpdate);
    }

    public void deleteById(UUID uid) {
        FieldParcel fieldParcel = fieldParcelRepository.findByUid(uid);

        if (fieldParcel == null || !fieldParcel.getIsActive()) {
            throw new EntityNotFoundException("Field parcel not found");
        }

        fieldParcel.setIsActive(Boolean.FALSE);
        fieldParcelRepository.save(fieldParcel);

        FieldParcelVersion fieldParcelVersion = fieldParcelVersionRepository.findByFieldParcelOrderByCreatedAtDesc(fieldParcel);
        CropFieldVersion currentFieldVersion = fieldParcelVersion.getCropFieldVersion();

        CropFieldVersion versionUpdates = currentFieldVersion.createClone();
        CropFieldVersion newCropFieldVersion = cropFieldVersionRepository.save(versionUpdates);

        Collection<FieldParcelVersion> fieldParcelVersions = currentFieldVersion.getFieldParcelVersions();

        fieldParcelVersions.forEach(fieldParcelVersion1 -> {
            if (!fieldParcelVersion1.getUid().equals(fieldParcelVersion.getUid()) &&
            fieldParcelVersion1.getFieldParcel().getIsActive()) {
                FieldParcelVersion newFieldParcelVersion = fieldParcelVersion1.createClone();
                newFieldParcelVersion.setCropFieldVersion(newCropFieldVersion);
                fieldParcelVersionRepository.save(newFieldParcelVersion);
            }
        });

    }
}
