package edu.bbte.allamvizsga.repository;

import edu.bbte.allamvizsga.model.FieldWork;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FieldWorkRepository extends JpaRepository<FieldWork, UUID>,
        JpaSpecificationExecutor<FieldWork>, ScrollableSpecificationExecutor<FieldWork> {
    FieldWork findByUid(UUID uid);


    List<FieldWork> findAll(Specification<FieldWork> fieldWorkSpecification, Sort sort);
}
