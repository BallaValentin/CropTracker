package edu.bbte.allamvizsga.services;

import edu.bbte.allamvizsga.model.CropCategory;
import edu.bbte.allamvizsga.repository.CropCategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.UUID;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class CropCategoryService {
    private CropCategoryRepository cropCategoryRepository;

    public Collection<CropCategory> getCropCategories() {
        return cropCategoryRepository.findAll();
    }

    public CropCategory findByID(UUID categoryId) {
        CropCategory cropCategory = cropCategoryRepository.findByUid(categoryId);

        if (cropCategory == null) {
            throw new EntityNotFoundException("Couldn`t find category with id " + categoryId);
        }

        return cropCategory;
    }
}
