package edu.bbte.allamvizsga.repository;

import edu.bbte.allamvizsga.model.WorkTypes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface WorkTypesRepository extends JpaRepository<WorkTypes, UUID>, JpaSpecificationExecutor<WorkTypes> {
    WorkTypes findByNameAndIsSystemTrue(String workType);
}
