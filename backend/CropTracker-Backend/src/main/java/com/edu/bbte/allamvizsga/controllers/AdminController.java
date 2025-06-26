package com.edu.bbte.allamvizsga.controllers;

import com.edu.bbte.allamvizsga.dto.response.AdminUserDTO;
import com.edu.bbte.allamvizsga.mappers.UserMapper;
import com.edu.bbte.allamvizsga.model.User;
import com.edu.bbte.allamvizsga.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Collection;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor(onConstructor = @__(@Autowired))
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping("/users")
    public ResponseEntity<Collection<AdminUserDTO>> getAllUsers() {
        Collection<User> users = userService.getAllUsers();
        Collection<AdminUserDTO> adminUserDTOS =
                users.stream().map(userMapper::modelToAdminResponse).toList();
        return ResponseEntity.ok().body(adminUserDTOS);
    }

}
