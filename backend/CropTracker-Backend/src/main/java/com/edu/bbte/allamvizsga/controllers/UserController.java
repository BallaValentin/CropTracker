package com.edu.bbte.allamvizsga.controllers;

import com.edu.bbte.allamvizsga.dto.request.AvatarUpdatesDTO;
import com.edu.bbte.allamvizsga.dto.request.ChangePasswordDTO;
import com.edu.bbte.allamvizsga.dto.request.UserUpdateDTO;
import com.edu.bbte.allamvizsga.dto.response.UserDataDTO;
import com.edu.bbte.allamvizsga.exceptions.InvalidSignupException;
import com.edu.bbte.allamvizsga.mappers.UserMapper;
import com.edu.bbte.allamvizsga.model.ResetPasswordToken;
import com.edu.bbte.allamvizsga.model.User;
import com.edu.bbte.allamvizsga.services.ResetPasswordTokenService;
import com.edu.bbte.allamvizsga.services.UserService;
import com.edu.bbte.allamvizsga.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

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

    protected User extractUser(String authorizationHeader) {
        String accessToken = authorizationHeader.substring(7);
        UUID uid = jwtUtil.getUid(accessToken);
        return userService.findUserById(uid);
    }

    @PutMapping("/change-avatar")
    public void changeAvatar(@Valid @RequestBody AvatarUpdatesDTO avatarUpdates,
                             @RequestHeader("Authorization") String authorizationHeader) throws IOException {
        User user = extractUser(authorizationHeader);
        userService.changeAvatar(user, avatarUpdates.getNewAvatarSrc());
    }

    @GetMapping("/fetch-user-data")
    public ResponseEntity<UserDataDTO> fetchUserData(
            @RequestHeader("Authorization") String authorizationHeader) throws IOException {
        User user = extractUser(authorizationHeader);
        UserDataDTO userData = userMapper.modelToUserData(user);

        return ResponseEntity.ok(userData);
    }

    @GetMapping("/get-avatar")
    public ResponseEntity<Resource> getAvatar(
            @RequestHeader("Authorization") String authorizationHeader) throws MalformedURLException {

        User user = extractUser(authorizationHeader);
        UUID userID = user.getUid();

        String uploadDir = "./images/" + userID + "/profile.png";
        Path path = Paths.get(uploadDir);

        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(resource);
    }

    @PutMapping("/update-profile")
    public ResponseEntity<UserDataDTO> updateProfile(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody UserUpdateDTO userUpdates) {

        log.info("Extracting user");
        User user = extractUser(authorizationHeader);
        log.info("Updating user");
        User updatedUser = userService.updateUser(user, userUpdates);
        log.info("Mapping response");
        UserDataDTO userData = userMapper.modelToUserData(updatedUser);

        return ResponseEntity.ok(userData);
    }

    @PutMapping("/update-password")
    public void updatePassword(@Valid @RequestBody ChangePasswordDTO changePasswordDTO) {
        UUID changePasswordToken = UUID.fromString(changePasswordDTO.getToken());

        if (!changePasswordDTO.getPassword1().equals(changePasswordDTO.getPassword2())) {
            throw new InvalidSignupException("Passwords do not match");
        }

        ResetPasswordToken resetPasswordToken = resetPasswordTokenService
                .findByUid(changePasswordToken);

        User tokenUser = resetPasswordToken.getUser();

        userService.updatePassword(tokenUser, changePasswordDTO.getPassword1());
    }
}
