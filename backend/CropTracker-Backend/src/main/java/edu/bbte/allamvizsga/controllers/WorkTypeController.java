package edu.bbte.allamvizsga.controllers;

import edu.bbte.allamvizsga.dto.request.workTypes.CreateWorkTypeDTO;
import edu.bbte.allamvizsga.dto.response.workTypes.GetWorkTypeDTO;
import edu.bbte.allamvizsga.mappers.WorkTypesMapper;
import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.model.WorkType;
import edu.bbte.allamvizsga.services.UserService;
import edu.bbte.allamvizsga.services.WorkTypeService;
import jakarta.validation.Valid;
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
public class WorkTypeController {
    private final WorkTypeService workTypesService;
    private final UserService userService;
    private final WorkTypesMapper workTypesMapper;

    @GetMapping("/findall")
    public ResponseEntity<Collection<GetWorkTypeDTO>> getWorkTypes(@RequestHeader("Authorization")
                                                                    String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);
        Collection<WorkType> workTypes = workTypesService.findAllOfUser(user);

        return ResponseEntity.ok(workTypes.stream().map(workTypesMapper::modelToGetWorkTypesDTO).toList());
    }

    @PostMapping("/create")
    public void create(@Valid @RequestBody CreateWorkTypeDTO createWorkTypeDTO, @RequestHeader("Authorization")
    String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);

        WorkType workType = workTypesMapper.createWorkTypesDTOtoModel(createWorkTypeDTO);
        workType.setIsSystem(false);
        workType.setUser(user);

        workTypesService.create(workType);
    }
}
