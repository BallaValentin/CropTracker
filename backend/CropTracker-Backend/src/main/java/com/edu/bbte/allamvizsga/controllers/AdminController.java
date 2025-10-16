package com.edu.bbte.allamvizsga.controllers;

import com.edu.bbte.allamvizsga.dto.response.AdminUserDTO;
import com.edu.bbte.allamvizsga.mappers.UserMapper;
import com.edu.bbte.allamvizsga.model.Role;
import com.edu.bbte.allamvizsga.model.User;
import com.edu.bbte.allamvizsga.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(value = "http://localhost:5174")
@AllArgsConstructor(onConstructor = @__(@Autowired))
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping("/get-users")
    public ResponseEntity<Collection<AdminUserDTO>> getAllUsers() {
        Collection<User> users = userService.getAllUsers();
        Collection<AdminUserDTO> adminUserDTOS = new ArrayList<>();

        AtomicInteger counter = new AtomicInteger(1);
        users.forEach(user -> {
            AdminUserDTO adminUserDTO = userMapper.modelToAdminResponse(user);
            adminUserDTO.setId(counter.getAndIncrement());
            Collection<Role> roles = user.getRoles();
            List<String> roleNames = roles.stream().map(Role::getName)
                    .collect(Collectors.toList());
            adminUserDTO.setRoles(roleNames);
            adminUserDTOS.add(adminUserDTO);
        });

        return ResponseEntity.ok().body(adminUserDTOS);
    }

}
