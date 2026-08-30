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

    public WorkType findByID(User user, UUID workTypeId) {
        WorkType workType = workTypesRepository.findByUid(workTypeId);

        if (workType == null || (!workType.getIsSystem() && workType.getUser() != user)) {
            throw new EntityNotFoundException("Work type not found.");
        }

        return workType;
    }

    public Collection<WorkType> findByPattern(User user, String pattern) {
        return workTypesRepository.findAll(Specification.allOf(
                (WorkTypeSpecification.byUser(user)
                        .or(WorkTypeSpecification.byIsSystem())
                ).and(WorkTypeSpecification.withPattern(pattern))
        ));
    }

    public WorkType findByUser(User user, UUID uid) {
        WorkType workType = workTypesRepository.findByUid(uid);

        if (workType == null) {
            throw new EntityNotFoundException("Work type not found.");
        }

        if (!workType.getIsSystem() && workType.getUser() != user) {
            throw new ForbiddenException("Access denied to work type.");
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
            throw new EntityExistsException("Work type name already taken.");
        }

        workTypesRepository.save(workType);
    }
}
