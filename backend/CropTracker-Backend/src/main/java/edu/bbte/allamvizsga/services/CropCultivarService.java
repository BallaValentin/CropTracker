package edu.bbte.allamvizsga.services;

import edu.bbte.allamvizsga.exceptions.BadRequestException;
import edu.bbte.allamvizsga.model.CropCultivar;
import edu.bbte.allamvizsga.model.CropSpecie;
import edu.bbte.allamvizsga.repository.CropCultivarRepository;
import edu.bbte.allamvizsga.specifications.CropCultivarSpecification;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.UUID;

@Service
@AllArgsConstructor(onConstructor_ = @__(@Autowired))
public class CropCultivarService {
    private final CropCultivarRepository cropCultivarRepository;

    public Collection<CropCultivar> findAllInSpecie(CropSpecie cropSpecie) {
        return cropCultivarRepository.findAll(Specification.allOf(
                CropCultivarSpecification.inSpecie(cropSpecie)
        ));
    }

    public Collection<CropCultivar> findAllWithPattern(String pattern, String language) {
        return cropCultivarRepository.findAll(Specification.allOf(
                CropCultivarSpecification.withPattern(pattern, language)
        ));
    }

    public CropCultivar create(CropCultivar cropCultivar) {
        CropCultivar cropCultivarWithName = cropCultivarRepository.findByCultivarName(
                cropCultivar.getCultivarName()
        );

        if (cropCultivarWithName != null && cropCultivar.getCropSpecie().equals(
                cropCultivarWithName.getCropSpecie()
        )) {
            throw new BadRequestException("Crop cultivar name already taken.");
        }

        return cropCultivarRepository.save(cropCultivar);
    }

    public CropCultivar findByID(UUID uid) {
        CropCultivar cropCultivar = cropCultivarRepository.findByUid(uid);

        if (cropCultivar == null) {
            throw new EntityNotFoundException("Crop cultivar not found.");
        }

        return cropCultivar;
    }

    public void update(CropCultivar cropCultivar) {
        CropCultivar oldVersion = cropCultivarRepository.findByUid(cropCultivar.getUid());

        if (oldVersion == null) {
            throw new EntityNotFoundException("Crop cultivar not found.");
        }

        Collection<CropCultivar> cropCultivarsWithName = cropCultivarRepository.findAll(
                Specification.allOf(CropCultivarSpecification.withCultivarName(
                        cropCultivar.getCultivarName()
                ))
        );

        cropCultivarsWithName.forEach(cropCultivarWithName -> {
            if (cropCultivarWithName.getCropSpecie().equals(
                    cropCultivar.getCropSpecie()
            ) && !cropCultivarWithName.getUid().equals(cropCultivar.getUid())) {
                throw new BadRequestException("Crop cultivar name already taken,");
            }
        });

        cropCultivarRepository.save(cropCultivar);
    }

    public void delete(UUID cropCultivarId) {
        CropCultivar cropCultivar = cropCultivarRepository.findByUid(cropCultivarId);

        if (cropCultivar == null) {
            throw new EntityNotFoundException("Crop cultivar not found.");
        }

        cropCultivarRepository.deleteById(cropCultivarId);
    }
}
