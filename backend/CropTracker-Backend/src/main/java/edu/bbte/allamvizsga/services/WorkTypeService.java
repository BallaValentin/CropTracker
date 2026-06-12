package edu.bbte.allamvizsga.services;

import edu.bbte.allamvizsga.exceptions.ForbiddenException;
import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.model.WorkType;
import edu.bbte.allamvizsga.repository.WorkTypesRepository;
import edu.bbte.allamvizsga.specifications.WorkTypeSpecification;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.UUID;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class WorkTypeService {
    private final WorkTypesRepository workTypesRepository;

    public Collection<WorkType> findAllOfUser(User user) {
        return workTypesRepository.findAll(Specification.allOf(
                WorkTypeSpecification.byUser(user).or(
                        WorkTypeSpecification.byIsSystem()
                )
        ));
    }

    public WorkType findByUser(User user, UUID uid) {
        WorkType workType = workTypesRepository.findByUid(uid);

        if (workType == null) {
            throw new EntityNotFoundException("Couldn`t find work type with id " + uid);
        }

        if (!workType.getIsSystem() && workType.getUser() != user) {
            throw new ForbiddenException("You have no access for this work type");
        }

        return workType;
    }

    public void create(WorkType workType) {
        WorkType workTypeWithSameName = null;

        if (workType.getUser() != null) {
            workTypeWithSameName = workTypesRepository.findByNameAndUser(workType.getName(), workType.getUser());
        }

        WorkType systemWorkTypeWithName = workTypesRepository.findByNameAndIsSystemTrue(workType.getName());

        if (workTypeWithSameName != null || systemWorkTypeWithName != null) {
            throw new EntityExistsException("Work type with name " + workType.getName() + " already exists");
        }

        workTypesRepository.save(workType);
    }
}
