package edu.bbte.allamvizsga.repository;

import edu.bbte.allamvizsga.model.CropCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CropCategoryRepository extends JpaRepository<CropCategory, UUID> {
    Optional<CropCategory> findByCategoryName(String categoryName);
}
