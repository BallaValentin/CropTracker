package edu.bbte.allamvizsga.controllers;

import edu.bbte.allamvizsga.dto.response.workTypes.GetWorkTypesDTO;
import edu.bbte.allamvizsga.mappers.WorkTypesMapper;
import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.model.WorkTypes;
import edu.bbte.allamvizsga.services.UserService;
import edu.bbte.allamvizsga.services.WorkTypesService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("/api/work-types")
@CrossOrigin(value = "http://localhost:5174")
@AllArgsConstructor(onConstructor_ = @__(@Autowired))
@PreAuthorize("hasRole('GROWER')")
@Slf4j
public class WorkTypesController {
    private final WorkTypesService workTypesService;
    private final UserService userService;
    private final WorkTypesMapper workTypesMapper;

    @GetMapping("/findall")
    public ResponseEntity<Collection<GetWorkTypesDTO>> getWorkTypes(@RequestHeader("Authorization")
                                                                    String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);
        Collection<WorkTypes> workTypes = workTypesService.findAllOfUser(user);

        return ResponseEntity.ok(workTypes.stream().map(workTypesMapper::modelToGetWorkTypesDTO).toList());
    }
 }
