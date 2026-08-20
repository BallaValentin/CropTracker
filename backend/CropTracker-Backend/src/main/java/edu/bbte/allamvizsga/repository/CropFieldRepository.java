package edu.bbte.allamvizsga.repository;

import edu.bbte.allamvizsga.model.CropField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.rmi.server.UID;
import java.util.UUID;

@Repository
public interface CropFieldRepository extends JpaRepository<CropField, UID>, JpaSpecificationExecutor<CropField> {
    CropField findByUid(UUID uid);
}
