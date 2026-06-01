package edu.bbte.allamvizsga.repository;

import edu.bbte.allamvizsga.model.FieldWork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FieldWorkRepository extends JpaRepository<FieldWork, UUID> {
}
