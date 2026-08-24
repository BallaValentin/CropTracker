package edu.bbte.allamvizsga.repository;

import edu.bbte.allamvizsga.model.CropSpecie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.UUID;

@Repository
public interface CropSpecieRepository extends JpaRepository<CropSpecie, UUID>, JpaSpecificationExecutor<CropSpecie> {
    CropSpecie findByCommonName(Map<String, String> commonName);

    CropSpecie findByScientificName(String scientificName);

    CropSpecie findByUid(UUID uid);
}
