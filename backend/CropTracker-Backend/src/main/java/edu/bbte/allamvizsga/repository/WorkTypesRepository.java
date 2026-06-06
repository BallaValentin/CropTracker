package edu.bbte.allamvizsga.repository;

import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.model.WorkType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface WorkTypesRepository extends JpaRepository<WorkType, UUID>, JpaSpecificationExecutor<WorkType> {
    WorkType findByNameAndIsSystemTrue(String workType);

    WorkType findByUid(UUID uid);

    WorkType findByNameAndUser(String name, User user);
}
