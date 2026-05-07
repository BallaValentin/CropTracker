package edu.bbte.allamvizsga.repository;

import edu.bbte.allamvizsga.model.FieldParcel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.rmi.server.UID;
import java.util.UUID;

@Repository
public interface FieldParcelRepository extends JpaRepository<FieldParcel, UID>, JpaSpecificationExecutor<FieldParcel> {
    FieldParcel findByUid(UUID uid);

    void deleteByUid(UUID uid);
}
