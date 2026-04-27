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
import java.util.UUID;

@Slf4j
@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class PlotService {
    private final PlotRepository plotRepository;

    public void createPlot(Plot plot) {
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
