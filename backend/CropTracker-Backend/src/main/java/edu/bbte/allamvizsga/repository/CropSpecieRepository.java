package edu.bbte.allamvizsga.repository;

import edu.bbte.allamvizsga.model.CropSpecie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CropSpecieRepository extends JpaRepository<CropSpecie, UUID> {
}
