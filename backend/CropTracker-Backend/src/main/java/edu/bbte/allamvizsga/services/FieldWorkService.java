package edu.bbte.allamvizsga.services;

import edu.bbte.allamvizsga.exceptions.ForbiddenException;
import edu.bbte.allamvizsga.model.CropField;
import edu.bbte.allamvizsga.model.FieldWork;
import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.repository.FieldWorkRepository;
import edu.bbte.allamvizsga.specifications.FieldWorkSpecification;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class FieldWorkService {
    private final FieldWorkRepository fieldWorkRepository;

    public void create(FieldWork fieldWork) {
        fieldWorkRepository.save(fieldWork);
    }

    public void update(FieldWork fieldWork) {
        FieldWork foundFieldWork = fieldWorkRepository.findByUid(fieldWork.getUid());

        if (foundFieldWork == null) {
            throw new EntityNotFoundException("Field work not found.");
        }

        if (fieldWork.getCropField() != foundFieldWork.getCropField()) {
            throw new ForbiddenException("Access denied to field work.");
        }

        fieldWorkRepository.save(fieldWork);
    }

    public Collection<FieldWork> findAll(User user) {
        return fieldWorkRepository.findAll(
                Specification.allOf(FieldWorkSpecification.byUser(user)),
                Sort.by(Sort.Direction.DESC, "startDate"));
    }

    public Page<FieldWork> findAllPastWorks(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, "startDate"));

        return fieldWorkRepository.findAll(
                Specification.allOf(FieldWorkSpecification.byUser(user)), pageable);
    }

    public Collection<FieldWork> findAllByCropField(CropField cropField) {
        return fieldWorkRepository.findAll(Specification.allOf(
                FieldWorkSpecification.byCropField(cropField)
                        .and(FieldWorkSpecification.byWorkTiming("Scheduled"))
        ), Sort.by(Sort.Direction.DESC, "startDate"));
    }

    public List<FieldWork> findAllWithinPastDays(
            CropField cropField, Instant referenceDate, Integer numberOfDays, List<UUID> selectedWorkTypes) {
        if (referenceDate == null || numberOfDays == null || numberOfDays < 0) {
            return Collections.emptyList();
        }
        Instant startDate = referenceDate.minus(numberOfDays, ChronoUnit.DAYS);

        return fieldWorkRepository.findAll(Specification.allOf(FieldWorkSpecification.byCropField(cropField).and(
                FieldWorkSpecification.withStartDateGreaterThanEqual(startDate)
                        .and(FieldWorkSpecification.byWorkTypeIn(selectedWorkTypes))
        )), Sort.by(Sort.Direction.ASC, "startDate"));
    }

    public FieldWork findById(UUID uid, User user) {
        FieldWork fieldWork = fieldWorkRepository.findByUid(uid);

        if (fieldWork == null) {
            throw new EntityNotFoundException("Field work not found.");
        }

        if (fieldWork.getCropField().getUser() != user) {
            throw new ForbiddenException("Access denied to field work.");
        }

        return fieldWork;
    }
}
