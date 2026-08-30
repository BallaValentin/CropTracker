package edu.bbte.allamvizsga.controllers;

import edu.bbte.allamvizsga.dto.request.workType.CreateWorkTypeDTO;
import edu.bbte.allamvizsga.dto.response.workType.GetWorkTypeDTO;
import edu.bbte.allamvizsga.dto.response.workType.GetWorkTypeNameDTO;
import edu.bbte.allamvizsga.mappers.WorkTypeMapper;
import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.model.WorkType;
import edu.bbte.allamvizsga.services.UserService;
import edu.bbte.allamvizsga.services.WorkTypeService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.jdbc.Work;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.UUID;

@RestController
@RequestMapping("/api/work-types")
@CrossOrigin(value = "http://localhost:5174")
@AllArgsConstructor(onConstructor_ = @__(@Autowired))
@PreAuthorize("hasRole('GROWER')")
@Slf4j
public class WorkTypeController {
    private final WorkTypeService workTypesService;
    private final UserService userService;
    private final WorkTypeMapper workTypeMapper;

    @GetMapping("/findall")
    public ResponseEntity<Collection<GetWorkTypeDTO>> getWorkTypes(@RequestHeader("Authorization")
                                                                   String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);
        Collection<WorkType> workTypes = workTypesService.findAllOfUser(user);

        return ResponseEntity.ok(workTypes.stream().map(workTypeMapper::modelToGetWorkTypesDTO).toList());
    }

    @GetMapping("/find-by-id")
    public ResponseEntity<GetWorkTypeDTO> getWorkTypes(@RequestHeader("Authorization")
                                                       String authorizationHeader, @RequestParam("workTypeId") UUID workTypeId) {
        User user = userService.extractUser(authorizationHeader);
        WorkType workType = workTypesService.findByID(user, workTypeId);

        return ResponseEntity.ok(workTypeMapper.modelToGetWorkTypesDTO(workType));
    }

    @GetMapping(value = "/findall", params = "pattern")
    public ResponseEntity<Collection<GetWorkTypeNameDTO>> getWorkTypesByPattern(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam("pattern") String pattern) {
        User user = userService.extractUser(authorizationHeader);

        Collection<WorkType> workTypes = workTypesService.findByPattern(user, pattern);

        return ResponseEntity.ok(workTypes.stream().map(workTypeMapper::modelToGetWorkTypeName).toList());
    }

    @PostMapping("/create")
    public void create(@Valid @RequestBody CreateWorkTypeDTO createWorkTypeDTO,
                       @RequestHeader("Authorization") String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);

        WorkType workType = workTypeMapper.createWorkTypesDTOtoModel(createWorkTypeDTO);
        workType.setIsSystem(false);
        workType.setUser(user);

        workTypesService.create(workType);
    }
}
