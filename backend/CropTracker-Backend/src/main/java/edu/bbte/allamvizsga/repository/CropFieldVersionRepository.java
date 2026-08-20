package edu.bbte.allamvizsga.repository;

import edu.bbte.allamvizsga.model.CropField;
import edu.bbte.allamvizsga.model.CropFieldVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CropFieldVersionRepository extends JpaRepository<CropFieldVersion, UUID> {
    CropFieldVersion findFirstByCropFieldOrderByCreatedAtDesc(CropField cropField);

    CropFieldVersion findByUid(UUID uid);
}
