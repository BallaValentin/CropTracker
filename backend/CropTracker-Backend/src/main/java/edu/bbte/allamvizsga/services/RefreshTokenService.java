package edu.bbte.allamvizsga.services;

import edu.bbte.allamvizsga.exceptions.RefreshTokenException;
import edu.bbte.allamvizsga.model.RefreshToken;
import edu.bbte.allamvizsga.repository.RefreshTokenRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;

    public void save(RefreshToken refreshToken) {
        refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken findByToken(String cookieValue) {
        if (cookieValue == null || cookieValue.isBlank()) {
            throw new RefreshTokenException("Missing cookie value.");
        }

        try {
            UUID token = UUID.fromString(cookieValue);
            RefreshToken refreshToken = refreshTokenRepository.findByToken(token);

            if (refreshToken != null && refreshToken.getExpires().isBefore(Instant.now())) {
                return null;
            }

            return refreshToken;
        } catch (IllegalArgumentException exception) {
            throw new RefreshTokenException("Invalid cookie format.");
        }
    }

    public void invalidateToken(String cookieValue) {
        RefreshToken refreshToken = findByToken(cookieValue);

        if (refreshToken == null) {
            throw new EntityNotFoundException("Refresh token not found.");
        }

        refreshTokenRepository.deleteByUid(refreshToken.getUid());
    }
}
