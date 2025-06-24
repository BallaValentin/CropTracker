package com.edu.bbte.allamvizsga.controllers;
import com.edu.bbte.allamvizsga.dto.request.LoginRequestDTO;
import com.edu.bbte.allamvizsga.dto.request.RegisterRequestDTO;
import com.edu.bbte.allamvizsga.dto.response.LoginResponseDTO;
import com.edu.bbte.allamvizsga.exceptions.InvalidSignupException;
import com.edu.bbte.allamvizsga.mappers.UserMapper;
import com.edu.bbte.allamvizsga.model.User;
import com.edu.bbte.allamvizsga.services.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(value = "http://localhost:5174", allowCredentials = "true")
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class AuthController {
    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping("/hello")
    public String hello() {
        return "Hello World";
    }

    @PostMapping("/signin")
    public ResponseEntity<LoginResponseDTO> signin(@Valid @RequestBody LoginRequestDTO loginRequest) {
        log.debug("Received login request");
        User user = userMapper.loginDtoToModel(loginRequest);
        User foundUser = userService.login(user);
        LoginResponseDTO loginResponseDTO = userMapper.modelToLoginDto(foundUser);
        return ResponseEntity.ok(loginResponseDTO);
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public void signup(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        log.debug("Received register request");

        if (!registerRequest.getPassword().equals(registerRequest.getPassword2())) {
            throw new InvalidSignupException("Passwords do not match");
        }

        User user = userMapper.registerDtoToModel(registerRequest);
        userService.createUser(user);
        userMapper.registerDtoToModel(registerRequest);
    }
}
