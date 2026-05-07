package edu.bbte.allamvizsga.services;

import edu.bbte.allamvizsga.exceptions.ForbiddenException;
import edu.bbte.allamvizsga.model.CropField;
import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.repository.CropFieldRepository;
import edu.bbte.allamvizsga.specifications.PlotSpecification;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Comparator;
import java.util.UUID;

@Slf4j
@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class CropFieldService {
    private final CropFieldRepository cropFieldRepository;

    protected Integer getNextNumber(String originalName) {
        Collection<CropField> plotsWithSameName = cropFieldRepository.findAll(
                Specification.allOf(
                        PlotSpecification.withNamePattern(originalName)
                                .and(PlotSpecification.notDeleted())
                )
        );

        return plotsWithSameName.stream().map(plot -> {
            String name = plot.getName();
            if(!name.contains("(")) {
                return 1;
            }
            try {
                return Integer.parseInt(name.substring(name.lastIndexOf("(") + 1,
                        name.lastIndexOf(")")));
            } catch (Exception e) {
                return 1;
            }
        }).max(Comparator.naturalOrder())
                .orElse(0) + 1;

    }

    public void createPlot(CropField cropField) {

        Integer count = getNextNumber(cropField.getName());

        if (count > 1) {
            cropField.setName(cropField.getName() + "(" + count + ")");
        }

        cropField.setIsDeleted(Boolean.FALSE);
        cropFieldRepository.save(cropField);
    }

    public CropField findPlotByUser(UUID plotId, User user) {
        CropField cropField = cropFieldRepository.findByUid(plotId);
        if (cropField == null) {
            throw new EntityNotFoundException("Couldn't find plot with id");
        }

        if (cropField.getUser() != user) {
            throw new ForbiddenException("Couldn't access this plot because you are not it's owner");
        }
        return cropField;
    }

    public void updatePlot(CropField cropField) {
        cropFieldRepository.save(cropField);
    }

    public Collection<CropField> getPlots(User user) {
        return cropFieldRepository.findAll(
                Specification.allOf(PlotSpecification
                        .byUser(user))
                        .and(PlotSpecification.notDeleted())

        );
    }

    public CropField findById(UUID uid) {
        CropField cropField = cropFieldRepository.findByUid(uid);
        if (cropField == null || cropField.getIsDeleted()) {
            throw new EntityNotFoundException("Couldn't find plot with id");
        }
        return cropField;
    }

    public void deleteById(UUID uid) {
        cropFieldRepository.softDeleteById(uid);
    }
}
