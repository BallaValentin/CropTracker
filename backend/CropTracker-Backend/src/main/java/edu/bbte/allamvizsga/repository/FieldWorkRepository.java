package edu.bbte.allamvizsga.repository;

import edu.bbte.allamvizsga.model.FieldWork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Collection;
import java.util.UUID;

@Repository
public interface FieldWorkRepository extends JpaRepository<FieldWork, UUID>, JpaSpecificationExecutor<FieldWork> {
    FieldWork findByUid(UUID uid);

    Collection<FieldWork> findByStartDateGreaterThanEqual(Instant startDateIsGreaterThan);
}
