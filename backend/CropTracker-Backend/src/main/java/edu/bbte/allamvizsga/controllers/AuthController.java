package edu.bbte.allamvizsga.controllers;

import edu.bbte.allamvizsga.dto.request.user.LoginRequestDTO;
import edu.bbte.allamvizsga.dto.request.user.RegisterRequestDTO;
import edu.bbte.allamvizsga.dto.request.user.ResendVerificationCodeDTO;
import edu.bbte.allamvizsga.dto.request.user.VerifyAccountDTO;
import edu.bbte.allamvizsga.dto.response.user.GetResendCodeDTO;
import edu.bbte.allamvizsga.dto.response.user.GetVerifyEmailTokenDTO;
import edu.bbte.allamvizsga.dto.response.user.LoginResponseDTO;
import edu.bbte.allamvizsga.dto.response.user.RefreshTokenResponseDTO;
import edu.bbte.allamvizsga.exceptions.RefreshTokenException;
import edu.bbte.allamvizsga.model.VerifyEmailToken;
import edu.bbte.allamvizsga.services.MailService;
import edu.bbte.allamvizsga.services.VerifyEmailTokenService;
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
import java.net.URI;
import java.util.Arrays;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(value = "http://localhost:5174", allowCredentials = "true")
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class AuthController {
    private final UserService userService;
    private final RefreshTokenService refreshTokenService;
    private final VerifyEmailTokenService verifyEmailTokenService;
    private final MailService mailService;
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

        RefreshToken refreshToken = new RefreshToken(foundUser, UUID.randomUUID().toString());
        refreshTokenService.save(refreshToken);

        Cookie refreshTokenCookie = new Cookie("refresh_token", refreshToken.getToken());
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setMaxAge(3600 * 24 * 30);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setAttribute("SameSite", "Strict");
        response.addCookie(refreshTokenCookie);

        return ResponseEntity.ok(loginResponseDTO);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<GetVerifyEmailTokenDTO> register(@Valid @RequestBody RegisterRequestDTO registerRequest) throws IOException {

        if (!registerRequest.getPassword().equals(registerRequest.getPassword2())) {
            throw new InvalidSignupException("Passwords do not match");
        }

        User user = userMapper.registerDtoToModel(registerRequest);
        user.setIsActive(Boolean.TRUE);
        user.setIsVerified(Boolean.FALSE);
        userService.createUser(user, registerRequest.getIsGrower(), registerRequest.getIsWorker());

        VerifyEmailToken verifyEmailToken = verifyEmailTokenService.createToken(user);

        mailService.sendEmailVerificationMail(user.getEmail(),
                user.getUsername(), verifyEmailToken.getVerificationCode());

        return new ResponseEntity<>(userMapper.modelToGetVerifyEmail(verifyEmailToken),
                HttpStatus.CREATED);
    }

    @PostMapping("/resend-code")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<GetResendCodeDTO> resendMail(@Valid @RequestBody ResendVerificationCodeDTO resendVerificationCodeDTO) {
        String email = resendVerificationCodeDTO.getEmail();

        User user = userService.findUserByEmail(email);

        verifyEmailTokenService.deleteByUser(user);
        VerifyEmailToken verifyEmailToken = verifyEmailTokenService.createToken(user);

        mailService.sendEmailVerificationMail(user.getEmail(), user.getUsername(),
                verifyEmailToken.getVerificationCode());

        return new ResponseEntity<>(userMapper.modelToGetResendCode(verifyEmailToken),
                HttpStatus.CREATED);
    }

    @PostMapping("/verify-account")
    public void verifyAccount(@Valid @RequestBody VerifyAccountDTO verifyAccountDTO) {
        userService.verifyAccount(verifyAccountDTO.getEmail(),
                verifyAccountDTO.getVerificationCode());
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<RefreshTokenResponseDTO> getRefreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies == null || Arrays.stream(cookies).findAny().isEmpty()) {
            throw new RefreshTokenException("Invalid or missing refresh token");
        }

        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("refresh_token")) {
                RefreshToken foundToken = refreshTokenService.findByToken(cookie.getValue());
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
        System.out.println("Received logout request");
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {
            System.out.println("Cookie: " + cookie.getName());
            if (cookie.getName().equals("refresh_token")) {
                System.out.println("Found token");
                refreshTokenService.invalidateToken(cookie.getValue());
                cookie.setMaxAge(0);
                cookie.setValue("");
                cookie.setPath("/");
                response.addCookie(cookie);
                return;
            }
        }
    }
}
