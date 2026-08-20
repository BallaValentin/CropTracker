package edu.bbte.allamvizsga.controllers;

import edu.bbte.allamvizsga.dto.request.user.UserRoleUpdatesDTO;
import edu.bbte.allamvizsga.dto.request.user.UserStatusUpdateDTO;
import edu.bbte.allamvizsga.dto.response.user.AdminUserDTO;
import edu.bbte.allamvizsga.exceptions.InvalidRoleException;
import edu.bbte.allamvizsga.mappers.UserMapper;
import edu.bbte.allamvizsga.model.Role;
import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.repository.RoleRepository;
import edu.bbte.allamvizsga.services.ImageService;
import edu.bbte.allamvizsga.services.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(value = "http://localhost:5174")
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final UserService userService;
    private final ImageService imageService;
    private final UserMapper userMapper;
    private final RoleRepository roleRepository;

    @GetMapping("/get-users")
    public ResponseEntity<Collection<AdminUserDTO>> getAllUsers() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        log.info(auth.getAuthorities().toString());
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

            UUID userID = user.getUid();

            String avatarUploadDir = "./images/" + userID + "/profile.png";
            Path avatarPath = Paths.get(avatarUploadDir);
            try {
                byte[] avatarImageBytes = Files.readAllBytes(avatarPath);
                String avatarBase64 = Base64.getEncoder().encodeToString(avatarImageBytes);
                String fullAvatarBase64 = "data:" + "image/png;base64," + avatarBase64;
                adminUserDTO.setAvatarSrc(fullAvatarBase64);

                adminUserDTOS.add(adminUserDTO);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });

        return ResponseEntity.ok().body(adminUserDTOS);
    }

    @GetMapping("/get-user-avatar")
    public ResponseEntity<Resource> getUserAvatar(@RequestParam UUID userID) {
        User user = userService.findUserById(userID);
        Resource userAvatar = imageService.getUserAvatar(user);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(userAvatar);
    }

    @PutMapping("/set-status")
    public void setUserStatus(@Valid @RequestBody UserStatusUpdateDTO userStatusUpdate) {
        User user = userService.findUserByUsername(userStatusUpdate.getUsername());

        userService.updateUserStatus(user, userStatusUpdate.getIsActive());
    }

    @PutMapping("/set-roles")
    public void setUserRoles(@Valid @RequestBody UserRoleUpdatesDTO userRoleUpdate) {
        User user = userService.findUserByUsername(userRoleUpdate.getUsername());

        Collection<Role> newRoles = userRoleUpdate.getRoles().stream()
                .map(roleName -> roleRepository.findByName(roleName)
                        .orElseThrow(() -> new InvalidRoleException("Invalid user role: " + roleName))
                )
                .collect(Collectors.toList());

        userService.updateUserRoles(user, newRoles);
    }

}
