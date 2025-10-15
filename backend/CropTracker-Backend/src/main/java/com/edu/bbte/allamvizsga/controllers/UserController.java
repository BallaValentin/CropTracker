package com.edu.bbte.allamvizsga.controllers;

import com.edu.bbte.allamvizsga.dto.request.AvatarUpdatesDTO;
import com.edu.bbte.allamvizsga.model.User;
import com.edu.bbte.allamvizsga.services.UserService;
import com.edu.bbte.allamvizsga.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(value = "http://localhost:5174")
@AllArgsConstructor(onConstructor_ = @__(@Autowired))
@Slf4j
public class UserController {
    private final JwtUtil jwtUtil;
    private final UserService userService;

    @PutMapping("/change-avatar")
    public void changeAvatar(@Valid @RequestBody AvatarUpdatesDTO avatarUpdates,
                             @RequestHeader("Authorization") String authorizationHeader) throws IOException {
        String accessToken = authorizationHeader.substring(7);
        String username = jwtUtil.getUsername(accessToken);
        User user = userService.findUserByUsername(username);
        userService.changeAvatar(user, avatarUpdates.getNewAvatarSrc());
    }
}
