package edu.bbte.allamvizsga.controllers;

import edu.bbte.allamvizsga.dto.request.user.ChangePasswordDTO;
import edu.bbte.allamvizsga.dto.request.user.UserUpdateDTO;
import edu.bbte.allamvizsga.dto.response.user.UserDataDTO;
import edu.bbte.allamvizsga.exceptions.InvalidSignupException;
import edu.bbte.allamvizsga.mappers.UserMapper;
import edu.bbte.allamvizsga.model.ResetPasswordToken;
import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.services.ImageService;
import edu.bbte.allamvizsga.services.ResetPasswordTokenService;
import edu.bbte.allamvizsga.services.UserService;
import edu.bbte.allamvizsga.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(value = "http://localhost:5174")
@AllArgsConstructor(onConstructor_ = @__(@Autowired))
@Slf4j
public class UserController {
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final UserMapper userMapper;
    private final ResetPasswordTokenService resetPasswordTokenService;
    private final ImageService imageService;

    @GetMapping("/fetch-user-data")
    public ResponseEntity<UserDataDTO> fetchUserData(
            @RequestHeader("Authorization") String authorizationHeader) {
        User user = userService.extractUser(authorizationHeader);
        UserDataDTO userData = userMapper.modelToUserData(user);

        return ResponseEntity.ok(userData);
    }

    @GetMapping("/get-avatar")
    public ResponseEntity<Resource> getAvatar(
            @RequestHeader("Authorization") String authorizationHeader) {

        User user = userService.extractUser(authorizationHeader);
        Resource userAvatar = imageService.getUserAvatar(user);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(userAvatar);
    }

    @PutMapping("/update-profile")
    public void updateProfile(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody UserUpdateDTO userUpdates) {

        User user = userService.extractUser(authorizationHeader);
        user.setUsername(userUpdates.getUsername());
        user.setFirstName(userUpdates.getFirstName());
        user.setLastName(userUpdates.getLastName());

        System.out.println(userUpdates);

        userService.updateUser(user, userUpdates.getAvatarUrl());
    }

    @PutMapping("/update-password")
    public void updatePassword(@Valid @RequestBody ChangePasswordDTO changePasswordDTO) {

        if (!changePasswordDTO.getPassword1().equals(changePasswordDTO.getPassword2())) {
            throw new InvalidSignupException("Passwords do not match");
        }

        ResetPasswordToken resetPasswordToken = resetPasswordTokenService
                .findByUid(changePasswordDTO.getToken());

        User tokenUser = resetPasswordToken.getUser();

        userService.updatePassword(tokenUser, changePasswordDTO.getPassword1());
    }
}
