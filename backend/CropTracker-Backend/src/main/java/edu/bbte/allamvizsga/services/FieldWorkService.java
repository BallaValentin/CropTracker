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

    public Collection<FieldWork> findall(User user) {
        return fieldWorkRepository.findAll(Sort.by(Sort.Direction.DESC, "startDate"))
                .stream().filter(fieldWork -> fieldWork.getCropField().getUser() == user).toList();
    }

    public List<FieldWork> findAllWithinPastDays(CropField cropField, Instant referenceDate, Integer numberOfDays) {
        if (referenceDate == null || numberOfDays == null || numberOfDays < 0) {
            return Collections.emptyList();
        }
        Instant startDate = referenceDate.minus(numberOfDays, ChronoUnit.DAYS);

        return fieldWorkRepository.findAll(Specification.allOf(FieldWorkSpecification.byCropField(cropField).and(
                        FieldWorkSpecification.withStartDateGreaterThanEqual(startDate)
                ))).stream()
                .sorted((fw1, fw2) -> Integer.compare(fw2.getAffectedRows().size(), fw1.getAffectedRows().size()))
                .toList();
    }

    public FieldWork findById(UUID uid, User user) {
        FieldWork fieldWork = fieldWorkRepository.findByUid(uid);

        if (fieldWork == null) {
            throw new EntityNotFoundException("Couldn`t find field work with id: " + uid);
        }

        if (fieldWork.getCropField().getUser() != user) {
            throw new ForbiddenException("You have no access to this field work");
        }

        return fieldWork;
    }
}
