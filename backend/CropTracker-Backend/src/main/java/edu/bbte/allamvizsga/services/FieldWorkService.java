package edu.bbte.allamvizsga.services;

import edu.bbte.allamvizsga.exceptions.ForbiddenException;
import edu.bbte.allamvizsga.model.FieldWork;
import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.repository.FieldWorkRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Collection;
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

    public FieldWork findById(UUID uid, User user) {
        FieldWork fieldWork = fieldWorkRepository.findByUid(uid);

        if (fieldWork == null) {
            throw new EntityNotFoundException("Coulnd`t find field work with id: " + uid);
        }

        if (fieldWork.getCropField().getUser() != user) {
            throw new ForbiddenException("You have no access to this field work");
        }

        return fieldWork;
    }
}
