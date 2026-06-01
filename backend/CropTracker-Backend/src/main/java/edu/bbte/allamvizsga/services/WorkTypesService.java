package edu.bbte.allamvizsga.services;

import edu.bbte.allamvizsga.exceptions.ForbiddenException;
import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.model.WorkTypes;
import edu.bbte.allamvizsga.repository.WorkTypesRepository;
import edu.bbte.allamvizsga.specifications.WorkTypesSpecification;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.UUID;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class WorkTypesService {
    private final WorkTypesRepository workTypesRepository;

    public Collection<WorkTypes> findAllOfUser(User user) {
        return workTypesRepository.findAll(Specification.allOf(
                WorkTypesSpecification.byUser(user).or(
                        WorkTypesSpecification.byIsSystem()
                )
        ));
    }

    public WorkTypes findByUser(User user, UUID uid) {
        WorkTypes workTypes = workTypesRepository.findByUid(uid);

        if (workTypes == null) {
            throw new EntityNotFoundException("Couldn`t find work type with id " + uid);
        }

        if (!workTypes.getIsSystem() && workTypes.getUser() != user) {
            throw new ForbiddenException("You have no access for this work type");
        }

        return workTypes;
    }
}
