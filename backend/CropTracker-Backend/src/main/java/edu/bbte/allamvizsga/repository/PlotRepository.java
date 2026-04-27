package edu.bbte.allamvizsga.repository;

import edu.bbte.allamvizsga.model.Plot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.rmi.server.UID;
import java.util.List;
import java.util.UUID;

@Repository
public interface PlotRepository extends JpaRepository<Plot, UID>, JpaSpecificationExecutor<Plot> {
    List<Plot> findAll();
    Plot findByUid(UUID uid);

    @Modifying
    @Transactional
    @Query("UPDATE Plot p SET p.isDeleted = true WHERE p.uid = :uid")
    void softDeleteById(UUID uid);
}
