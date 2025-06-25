package com.edu.bbte.allamvizsga.controllers;
import com.edu.bbte.allamvizsga.dto.request.LoginRequestDTO;
import com.edu.bbte.allamvizsga.dto.request.RegisterRequestDTO;
import com.edu.bbte.allamvizsga.dto.response.LoginResponseDTO;
import com.edu.bbte.allamvizsga.exceptions.InvalidSignupException;
import com.edu.bbte.allamvizsga.mappers.UserMapper;
import com.edu.bbte.allamvizsga.model.RefreshToken;
import com.edu.bbte.allamvizsga.model.User;
import com.edu.bbte.allamvizsga.services.RefreshTokenService;
import com.edu.bbte.allamvizsga.services.UserService;
import com.edu.bbte.allamvizsga.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(value = "http://localhost:5174", allowCredentials = "true")
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class AuthController {
    private final UserService userService;
    private final RefreshTokenService refreshTokenService;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @GetMapping("/hello")
    public String hello() {
        return "Hello World";
    }

    @PostMapping("/authenticate")
    public ResponseEntity<LoginResponseDTO> authenticate(@Valid @RequestBody LoginRequestDTO loginRequest) {
        log.debug("Received login request");
        User user = userMapper.loginDtoToModel(loginRequest);
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );

        User foundUser = userService.authenticate(user);
        LoginResponseDTO loginResponseDTO = userMapper.modelToLoginDto(foundUser);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails.getUsername());
        loginResponseDTO.setAccessToken(token);

        RefreshToken refreshToken = new RefreshToken(foundUser, UUID.randomUUID());
        refreshTokenService.save(refreshToken);

        return ResponseEntity.ok(loginResponseDTO);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        log.debug("Received register request");

        if (!registerRequest.getPassword().equals(registerRequest.getPassword2())) {
            throw new InvalidSignupException("Passwords do not match");
        }

        User user = userMapper.registerDtoToModel(registerRequest);
        userService.createUser(user);
        userMapper.registerDtoToModel(registerRequest);
    }
}
