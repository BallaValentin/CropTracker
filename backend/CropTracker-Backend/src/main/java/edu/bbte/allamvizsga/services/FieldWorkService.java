package edu.bbte.allamvizsga.services;

import edu.bbte.allamvizsga.exceptions.ForbiddenException;
import edu.bbte.allamvizsga.model.*;
import edu.bbte.allamvizsga.repository.FieldWorkRepository;
import edu.bbte.allamvizsga.specifications.FieldWorkSpecification;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class FieldWorkService {
    private final FieldWorkRepository fieldWorkRepository;

    public void create(FieldWork fieldWork) {
        fieldWorkRepository.save(fieldWork);
    }

    public void update(FieldWork fieldWork) {
        FieldWork foundFieldWork = fieldWorkRepository.findByUid(fieldWork.getUid());

        if (foundFieldWork == null || !fieldWork.getIsActive()) {
            throw new EntityNotFoundException("Field work not found.");
        }

        if (fieldWork.getCropFieldVersion() != foundFieldWork.getCropFieldVersion()) {
            throw new ForbiddenException("Access denied to field work.");
        }

        fieldWorkRepository.save(fieldWork);
    }

    public Collection<FieldWork> findAll(User user) {
        return fieldWorkRepository.findAll(
                Specification.allOf(FieldWorkSpecification.byUser(user)),
                Sort.by(Sort.Direction.DESC, "startDate"));
    }

    protected ScrollPosition getScrollPosition(UUID lastSeen) {
        if (lastSeen == null) {
            return ScrollPosition.keyset();
        }

        Map<String, Object> keys = Map.of("uid", lastSeen);

        return ScrollPosition.of(keys, ScrollPosition.Direction.FORWARD);
    }

    public List<FieldWork> findAllPastWorks(User user, WorkType workType, CropField cropField, UUID lastSeen, int pageSize) {
        ScrollPosition scrollPosition = getScrollPosition(lastSeen);

        Window<FieldWork> fieldWorksWindows = fieldWorkRepository.scrollAll(
                Specification.allOf(FieldWorkSpecification.byUser(user)
                        .and(FieldWorkSpecification.byWorkType(workType))
                        .and(FieldWorkSpecification.byCropField(cropField))), scrollPosition, pageSize, "uid");

        return fieldWorksWindows.getContent();
    }

    public Collection<FieldWork> findAllByCropField(CropFieldVersion cropFieldVersion) {
        return fieldWorkRepository.findAll(Specification.allOf(
                FieldWorkSpecification.byCropFieldVersion(cropFieldVersion)
                        .and(FieldWorkSpecification.byWorkTiming("Scheduled"))
        ), Sort.by(Sort.Direction.DESC, "startDate"));
    }

    public List<FieldWork> findAllWithinPastDays(
            CropFieldVersion cropFieldVersion, OffsetDateTime referenceDate, Integer numberOfDays, List<UUID> selectedWorkTypes) {
        if (referenceDate == null || numberOfDays == null || numberOfDays < 0) {
            return Collections.emptyList();
        }
        OffsetDateTime startDate = referenceDate.minusDays(numberOfDays);

        return fieldWorkRepository.findAll(Specification.allOf(FieldWorkSpecification.byCropFieldVersion(cropFieldVersion).and(
                FieldWorkSpecification.withStartDateGreaterThanOrEqual(startDate)
                        .and(FieldWorkSpecification.byWorkTypeIn(selectedWorkTypes))
        )), Sort.by(Sort.Direction.ASC, "startDate"));
    }

    public FieldWork findById(UUID uid, User user) {
        FieldWork fieldWork = fieldWorkRepository.findByUid(uid);

        if (fieldWork == null || !fieldWork.getIsActive()) {
            throw new EntityNotFoundException("Field work not found.");
        }

        if (fieldWork.getCropFieldVersion().getCropField().getUser() != user) {
            throw new ForbiddenException("Access denied to field work.");
        }

        return fieldWork;
    }

    public void deleteAll(User user, List<UUID> fieldWorkIds) {
        fieldWorkIds.forEach(fieldWorkId -> {
            FieldWork fieldWork = findById(fieldWorkId, user);
            fieldWork.setIsActive(Boolean.FALSE);
            fieldWorkRepository.save(fieldWork);
        });
    }
}
