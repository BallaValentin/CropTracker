package edu.bbte.allamvizsga.services;

import edu.bbte.allamvizsga.exceptions.ForbiddenException;
import edu.bbte.allamvizsga.model.Plot;
import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.repository.PlotRepository;
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
public class PlotService {
    private final PlotRepository plotRepository;

    protected Integer getNextNumber(String originalName) {
        Collection<Plot> plotsWithSameName = plotRepository.findAll(
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

    public void createPlot(Plot plot) {

        Integer count = getNextNumber(plot.getName());

        if (count > 1) {
            plot.setName(plot.getName() + "(" + count + ")");
        }

        plot.setIsDeleted(Boolean.FALSE);
        plotRepository.save(plot);
    }

    public Plot findPlotByUser(UUID plotId, User user) {
        Plot plot = plotRepository.findByUid(plotId);
        if (plot == null) {
            throw new EntityNotFoundException("Couldn't find plot with id");
        }

        if (plot.getUser() != user) {
            throw new ForbiddenException("Couldn't access this plot because you are not it's owner");
        }
        return plot;
    }

    public void updatePlot(Plot plot) {
        plotRepository.save(plot);
    }

    public Collection<Plot> getPlots(User user) {
        return plotRepository.findAll(
                Specification.allOf(PlotSpecification
                        .byUser(user))
                        .and(PlotSpecification.notDeleted())

        );
    }

    public Plot findById(UUID uid) {
        Plot plot = plotRepository.findByUid(uid);
        if (plot == null || plot.getIsDeleted()) {
            throw new EntityNotFoundException("Couldn't find plot with id");
        }
        return plot;
    }

    public void deleteById(UUID uid) {
        plotRepository.softDeleteById(uid);
    }
}
