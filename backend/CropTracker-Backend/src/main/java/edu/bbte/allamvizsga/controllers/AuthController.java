package edu.bbte.allamvizsga.controllers;
import edu.bbte.allamvizsga.dto.request.LoginRequestDTO;
import edu.bbte.allamvizsga.dto.request.RegisterRequestDTO;
import edu.bbte.allamvizsga.dto.response.LoginResponseDTO;
import edu.bbte.allamvizsga.dto.response.RefreshTokenResponseDTO;
import edu.bbte.allamvizsga.exceptions.RefreshTokenException;
import org.springframework.http.ResponseEntity;
import edu.bbte.allamvizsga.exceptions.InvalidSignupException;
import edu.bbte.allamvizsga.mappers.UserMapper;
import edu.bbte.allamvizsga.model.RefreshToken;
import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.services.RefreshTokenService;
import edu.bbte.allamvizsga.services.UserService;
import edu.bbte.allamvizsga.util.JwtUtil;
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
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
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

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> authenticate(
            @Valid @RequestBody LoginRequestDTO loginRequest,
            HttpServletResponse response) {

        User user = userMapper.loginDtoToModel(loginRequest);
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );

        User foundUser = userService.authenticate(user);

        String token = jwtUtil.generateToken(foundUser.getUid());
        LoginResponseDTO loginResponseDTO = new LoginResponseDTO();
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
        user.setIsActive(Boolean.TRUE);
        userService.createUser(user, registerRequest.getIsGrower(), registerRequest.getIsWorker());
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
                    String accessToken = jwtUtil.generateToken(foundToken.getUser().getUid());
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
