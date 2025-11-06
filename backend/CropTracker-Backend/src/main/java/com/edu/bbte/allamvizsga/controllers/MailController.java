package com.edu.bbte.allamvizsga.controllers;

import com.edu.bbte.allamvizsga.dto.request.VerifyEmailDTO;
import com.edu.bbte.allamvizsga.model.User;
import com.edu.bbte.allamvizsga.services.MailService;
import com.edu.bbte.allamvizsga.services.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/mail")
@CrossOrigin(value = "http://localhost:5174")
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class MailController {
    private final MailService mailService;
    private final UserService userService;

    @PostMapping("/reset-password")
    public void verifyEmail(@Valid @RequestBody VerifyEmailDTO emailDTO) {
        String mailTo = emailDTO.getEmail();
        User user = userService.findUserByEmail(mailTo);

        String resetToken = UUID.randomUUID().toString();

        mailService.sendVerificationEmail(mailTo, user.getUsername(), resetToken);
    }
}
