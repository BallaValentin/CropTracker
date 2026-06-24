package edu.bbte.allamvizsga.repository;

import edu.bbte.allamvizsga.model.CropField;
import edu.bbte.allamvizsga.model.FieldWork;
import edu.bbte.allamvizsga.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.lang.reflect.Field;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
public interface FieldWorkRepository extends JpaRepository<FieldWork, UUID>, JpaSpecificationExecutor<FieldWork> {
    FieldWork findByUid(UUID uid);


    List<FieldWork> findAll(Specification<FieldWork> fieldWorkSpecification, Sort sort);

    Page<FieldWork> findAll(Specification<FieldWork> fieldWorkSpecification, Pageable pageable);
}
