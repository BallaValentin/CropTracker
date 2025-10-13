package com.edu.bbte.allamvizsga.controllers;
import com.edu.bbte.allamvizsga.dto.request.LoginRequestDTO;
import com.edu.bbte.allamvizsga.dto.request.RegisterRequestDTO;
import com.edu.bbte.allamvizsga.dto.response.LoginResponseDTO;
import com.edu.bbte.allamvizsga.dto.response.RefreshTokenResponseDTO;
import com.edu.bbte.allamvizsga.exceptions.RefreshTokenException;
import org.springframework.http.ResponseEntity;
import com.edu.bbte.allamvizsga.exceptions.InvalidSignupException;
import com.edu.bbte.allamvizsga.mappers.UserMapper;
import com.edu.bbte.allamvizsga.model.RefreshToken;
import com.edu.bbte.allamvizsga.model.User;
import com.edu.bbte.allamvizsga.services.RefreshTokenService;
import com.edu.bbte.allamvizsga.services.UserService;
import com.edu.bbte.allamvizsga.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
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
    public ResponseEntity<LoginResponseDTO> authenticate(
            @Valid @RequestBody LoginRequestDTO loginRequest,
            HttpServletResponse response) throws IOException {

        log.debug("Received login request");
        User user = userMapper.loginDtoToModel(loginRequest);
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );

        User foundUser = userService.authenticate(user);
        LoginResponseDTO loginResponseDTO = userMapper.modelToLoginDto(foundUser);

        String base64 = null;

        String imagePath = "./images/" + foundUser.getUid() + "/profile.png";
        Path path = Path.of(imagePath);

        if(Files.exists(path)) {
            byte[] bytes = Files.readAllBytes(path);
            base64 = "data:image/png;base64," + Base64.getEncoder().encodeToString(bytes);
        }

        loginResponseDTO.setAvatar(base64);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails.getUsername());
        loginResponseDTO.setAccessToken(token);

        RefreshToken refreshToken = new RefreshToken(foundUser, UUID.randomUUID());
        refreshTokenService.save(refreshToken);

        Cookie refreshTokenCookie = new Cookie("refresh_token", refreshToken.getToken().toString());
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setMaxAge(3600 * 24);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setAttribute("SameSite", "Strict");
        response.addCookie(refreshTokenCookie);

        return ResponseEntity.ok(loginResponseDTO);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@Valid @RequestBody RegisterRequestDTO registerRequest) throws IOException {
        log.debug("Received register request");

        if (!registerRequest.getPassword().equals(registerRequest.getPassword2())) {
            throw new InvalidSignupException("Passwords do not match");
        }

        User user = userMapper.registerDtoToModel(registerRequest);
        userService.createUser(user);
        userMapper.registerDtoToModel(registerRequest);
    }

    @GetMapping("/refresh-token")
    public ResponseEntity<RefreshTokenResponseDTO> refreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            throw new RefreshTokenException("Invalid or missing refresh token");
        }

        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("refresh_token")) {
                UUID refreshToken = UUID.fromString(cookie.getValue());
                RefreshToken foundToken = refreshTokenService.findByToken(refreshToken);
                if (foundToken != null) {
                    String accessToken = jwtUtil.generateToken(foundToken.getUser().getUsername());
                    RefreshTokenResponseDTO refreshTokenResponseDTO = new RefreshTokenResponseDTO(accessToken);
                    return ResponseEntity.ok(refreshTokenResponseDTO);
                }
            }
        }
        throw new RefreshTokenException("Invalid or missing refresh token");
    }

    @GetMapping("/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie: cookies) {
            if (cookie.getName().equals("refresh-token")) {
                cookie.setMaxAge(0);
                cookie.setValue("");
                cookie.setPath("/");
                response.addCookie(cookie);
                return;
            }
        }
    }
}
