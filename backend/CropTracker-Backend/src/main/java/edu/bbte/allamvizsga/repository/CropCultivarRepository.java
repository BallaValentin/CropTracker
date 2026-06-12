package edu.bbte.allamvizsga.repository;

import edu.bbte.allamvizsga.model.CropCultivar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CropCultivarRepository extends JpaRepository<CropCultivar, UUID>, JpaSpecificationExecutor<CropCultivar> {
    CropCultivar findByCultivarName(String cultivarName);

    CropCultivar findByUid(UUID uid);
}
