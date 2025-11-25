package com.edu.bbte.allamvizsga.services;

import com.edu.bbte.allamvizsga.model.Plot;
import com.edu.bbte.allamvizsga.model.User;
import com.edu.bbte.allamvizsga.repository.PlotRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class PlotService {
    private final PlotRepository plotRepository;

    public void createPlot(Plot plot) {
        plotRepository.save(plot);
    }

    public Collection<Plot> getPlots(User user) {
        return plotRepository.findAllByUser(user);
    }
}
