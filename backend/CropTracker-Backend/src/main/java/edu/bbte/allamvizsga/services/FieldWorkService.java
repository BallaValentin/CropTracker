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
import java.time.ZoneOffset;
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
                Specification.allOf(FieldWorkSpecification.byUser(user))
                        .and(FieldWorkSpecification.byIsActive()),
                Sort.by(Sort.Direction.DESC, "startDate"));
    }

    public Collection<FieldWork> findAllByDay(User user, OffsetDateTime userDateTime) {
        OffsetDateTime startOfDayUtc = userDateTime
                .withOffsetSameInstant(ZoneOffset.UTC)
                .truncatedTo(ChronoUnit.DAYS);

        OffsetDateTime endOfDayUtc = startOfDayUtc
                .plusDays(1)
                .minusNanos(1);
        
        return fieldWorkRepository.findAll(
                FieldWorkSpecification.byUser(user)
                        .and(FieldWorkSpecification.byIsActive())
                        .and(FieldWorkSpecification.withStartDateBetween(startOfDayUtc, endOfDayUtc)),
                Sort.by(Sort.Direction.ASC, "startDate")

        );
    }

    public Collection<FieldWork> findAllWithinDays(User user, int numberOfDays) {
        OffsetDateTime pastDateTime = OffsetDateTime.now().minusDays(numberOfDays);

        return fieldWorkRepository.findAll(Specification.allOf(
                FieldWorkSpecification.byUser(user)
                        .and(FieldWorkSpecification.byIsActive())
                        .and(FieldWorkSpecification.byStartDateAfter(pastDateTime))),
                Sort.by(Sort.Direction.ASC, "startDate")
        );
    }

    protected ScrollPosition getScrollPosition(UUID lastSeen) {
        if (lastSeen == null) {
            return ScrollPosition.keyset();
        }

        Map<String, Object> keys = Map.of("uid", lastSeen);

        return ScrollPosition.of(keys, ScrollPosition.Direction.FORWARD);
    }

    public List<FieldWork> findAllPastWorks(User user, Collection<WorkType> workTypes, Collection<CropField> cropFields, UUID lastSeen, int pageSize) {
        ScrollPosition scrollPosition = getScrollPosition(lastSeen);

        Window<FieldWork> fieldWorksWindows = fieldWorkRepository.scrollAll(
                Specification.allOf(FieldWorkSpecification.byUser(user)
                        .and(FieldWorkSpecification.byIsActive())
                        .and(FieldWorkSpecification.byWorkTypeCollection(workTypes))
                        .and(FieldWorkSpecification.byWorkTiming("Past"))
                        .and(FieldWorkSpecification.byCropFieldCollection(cropFields))), scrollPosition, pageSize, "startDate");

        return fieldWorksWindows.getContent();
    }

    public List<FieldWork> findAllScheduled(CropFieldVersion cropFieldVersion) {
        return fieldWorkRepository.findAll(Specification.allOf(
                FieldWorkSpecification.byCropFieldVersion(cropFieldVersion)
                        .and(FieldWorkSpecification.byIsActive())
                        .and(FieldWorkSpecification.byWorkTiming("Scheduled"))
                        .and(FieldWorkSpecification.byStartDateAfter(OffsetDateTime.now()))
        ));
    }

    public List<FieldWork> findAllOngoing(CropFieldVersion cropFieldVersion) {
        return fieldWorkRepository.findAll(Specification.allOf(
                FieldWorkSpecification.byCropFieldVersion(cropFieldVersion)
                        .and(FieldWorkSpecification.byIsActive())
                        .and(FieldWorkSpecification.byWorkTiming("Scheduled"))
                        .and(FieldWorkSpecification.byStartDateBefore(OffsetDateTime.now()))
        ));
    }

    public Collection<FieldWork> findAllByCropField(CropField cropField) {
        return fieldWorkRepository.findAll(Specification.allOf(
                FieldWorkSpecification.byCropField(cropField)
                        .and(FieldWorkSpecification.byIsActive())
                        .and(FieldWorkSpecification.byWorkTiming("Scheduled"))
        ), Sort.by(Sort.Direction.DESC, "startDate"));
    }

    public void updateScheduledWork(FieldWork fieldWork) {
        fieldWorkRepository.save(fieldWork);
    }

    public List<FieldWork> findAllWithinPastDays(
            CropFieldVersion cropFieldVersion, OffsetDateTime referenceDate, Integer numberOfDays, List<UUID> selectedWorkTypes) {
        if (referenceDate == null || numberOfDays == null || numberOfDays < 0) {
            return Collections.emptyList();
        }
        OffsetDateTime startDate = referenceDate.minusDays(numberOfDays);

        return fieldWorkRepository.findAll(Specification.allOf(
                FieldWorkSpecification.byCropFieldVersion(cropFieldVersion)
                        .and(FieldWorkSpecification.byWorkTypeIn(selectedWorkTypes))
                        .and(FieldWorkSpecification.byStartDateAfter(startDate))
                        .and(FieldWorkSpecification.byIsActive())
        ),Sort.by(Sort.Direction.ASC, "startDate"));
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
