package com.edu.bbte.allamvizsga.controllers;

import com.edu.bbte.allamvizsga.dto.request.CreatePlotDTO;
import com.edu.bbte.allamvizsga.dto.response.GetPlotDTO;
import com.edu.bbte.allamvizsga.mappers.PlotMapper;
import com.edu.bbte.allamvizsga.model.Plot;
import com.edu.bbte.allamvizsga.model.User;
import com.edu.bbte.allamvizsga.services.PlotService;
import com.edu.bbte.allamvizsga.services.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/plot")
@CrossOrigin(value = "http://localhost:5174")
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class PlotController {
    private final PlotService plotService;
    private final UserService userService;
    private final PlotMapper plotMapper;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public void createPlot(@Valid @RequestBody CreatePlotDTO createPlotDTO,
                           @RequestHeader("Authorization") String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);
        Plot plot = plotMapper.createPlotDTOtoModel(createPlotDTO);
        plot.setUser(user);
        plotService.createPlot(plot);
    }

    @GetMapping("/findall")
    public ResponseEntity<Collection<GetPlotDTO>> getPlots(
            @RequestHeader("Authorization") String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);
        Collection<Plot> plots = plotService.getPlots(user);

        Collection<GetPlotDTO> getPlotDTOS = plots.stream().map(plotMapper::modelToGetPlotDTO).toList();
        return ResponseEntity.ok(getPlotDTOS);
    }
}
