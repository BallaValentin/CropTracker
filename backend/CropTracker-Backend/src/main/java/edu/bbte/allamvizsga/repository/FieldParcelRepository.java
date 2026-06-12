package edu.bbte.allamvizsga.repository;

import edu.bbte.allamvizsga.model.FieldParcel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FieldParcelRepository extends JpaRepository<FieldParcel, UUID>, JpaSpecificationExecutor<FieldParcel> {
    FieldParcel findByUid(UUID uid);
}
