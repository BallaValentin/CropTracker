package edu.bbte.allamvizsga.services;

import edu.bbte.allamvizsga.exceptions.BadRequestException;
import edu.bbte.allamvizsga.model.CropCategory;
import edu.bbte.allamvizsga.model.CropSpecie;
import edu.bbte.allamvizsga.repository.CropSpecieRepository;
import edu.bbte.allamvizsga.specifications.CropSpecieSpecification;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.UUID;

@Slf4j
@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class CropSpecieService {
    private CropSpecieRepository cropSpecieRepository;

    public Collection<CropSpecie> findAllByCategory(CropCategory cropCategory) {
        return cropSpecieRepository.findAll(Specification.allOf(
                CropSpecieSpecification.byCategory(cropCategory)
        ));
    }

    public Collection<CropSpecie> findAllWithPattern(String pattern) {
        return cropSpecieRepository.findAll(Specification.allOf(
                CropSpecieSpecification.withPattern(pattern)
        ));
    }

    public CropSpecie findByID(UUID uid) {
        CropSpecie cropSpecie = cropSpecieRepository.findByUid(uid);

        if (cropSpecie == null) {
            throw new EntityNotFoundException("Crop specie not found.");
        }

        return cropSpecie;
    }

    public CropSpecie create(CropSpecie cropSpecie) {
        if (cropSpecieRepository.findByCommonName(cropSpecie.getCommonName()) != null) {
            throw new BadRequestException("Crop specie name already taken.");
        }

        if (cropSpecie.getScientificName() != null && cropSpecieRepository.findByScientificName(cropSpecie.getScientificName()) != null) {
            throw new BadRequestException("Crop specie scientific name already taken.");
        }

        return cropSpecieRepository.save(cropSpecie);
    }

    public void update(CropSpecie cropSpecie) {
        CropSpecie oldCropSpecie = cropSpecieRepository.findByUid(cropSpecie.getUid());
        if (oldCropSpecie == null) {
            throw new EntityNotFoundException("Crop specie not found.");
        }

        CropSpecie cropSpecieWithName = cropSpecieRepository
                .findByCommonName(cropSpecie.getCommonName());

        if (cropSpecieWithName != null &&
                !cropSpecieWithName.getUid().equals(cropSpecie.getUid())
        ) {
            throw new BadRequestException("Crop specie name already taken.");
        }

        if (cropSpecie.getScientificName() != null) {
            CropSpecie cropSpecieWithScientificName = cropSpecieRepository
                    .findByScientificName(cropSpecie.getScientificName());
            if (cropSpecieWithScientificName != null &&
                    !cropSpecieWithScientificName.getUid().equals(cropSpecie.getUid())) {
                throw new BadRequestException("Crop specie scientific name already taken.");
            }
        }

        cropSpecieRepository.save(cropSpecie);
    }

    public void delete(UUID cropSpecieId) {
        CropSpecie cropSpecie = cropSpecieRepository.findByUid(cropSpecieId);

        if (cropSpecie == null) {
            throw new EntityNotFoundException("Crop specie not found.");
        }

        cropSpecieRepository.deleteById(cropSpecieId);
    }
}
