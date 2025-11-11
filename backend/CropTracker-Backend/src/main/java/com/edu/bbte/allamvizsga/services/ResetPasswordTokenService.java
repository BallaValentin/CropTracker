package com.edu.bbte.allamvizsga.services;

import com.edu.bbte.allamvizsga.exceptions.InvalidEntityException;
import com.edu.bbte.allamvizsga.model.ResetPasswordToken;
import com.edu.bbte.allamvizsga.repository.ResetPasswordTokenRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class ResetPasswordTokenService {
    private static final Logger log = LoggerFactory.getLogger(ResetPasswordTokenService.class);
    private final ResetPasswordTokenRepository resetPasswordTokenRepository;

    public void addToken(ResetPasswordToken resetPasswordToken) {
        resetPasswordTokenRepository.save(resetPasswordToken);
    }

    public ResetPasswordToken findByUid(UUID uid) {
        Optional<ResetPasswordToken> resetPasswordToken = resetPasswordTokenRepository.findByUid(uid);
        if (resetPasswordToken.isPresent()) {
            ResetPasswordToken resetPasswordTokenVal = resetPasswordToken.get();
            if (resetPasswordTokenVal.getExpires().isBefore(Instant.now())) {
                throw new InvalidEntityException("Reset password token has been expired");
            }
            return resetPasswordToken.get();
        } else {
            throw new EntityNotFoundException("Reset password token not found");
        }
    }
}
