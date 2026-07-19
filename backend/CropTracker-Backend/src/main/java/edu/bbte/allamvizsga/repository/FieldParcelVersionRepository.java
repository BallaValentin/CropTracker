package edu.bbte.allamvizsga.repository;

import edu.bbte.allamvizsga.model.FieldParcel;
import edu.bbte.allamvizsga.model.FieldParcelVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FieldParcelVersionRepository extends JpaRepository<FieldParcelVersion, UUID>, JpaSpecificationExecutor<FieldParcelVersion> {
    FieldParcelVersion findFirstByFieldParcelOrderByCreatedAtDesc(FieldParcel fieldParcel);

    FieldParcelVersion findByUid(UUID uid);
}
