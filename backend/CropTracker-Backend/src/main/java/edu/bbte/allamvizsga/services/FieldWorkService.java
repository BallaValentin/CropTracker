package edu.bbte.allamvizsga.services;

import edu.bbte.allamvizsga.model.FieldWork;
import edu.bbte.allamvizsga.repository.FieldWorkRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class FieldWorkService {
    private final FieldWorkRepository fieldWorkRepository;

    public void create(FieldWork fieldWork) {
        fieldWorkRepository.save(fieldWork);
    }
}
