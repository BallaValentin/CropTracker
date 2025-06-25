package com.edu.bbte.allamvizsga.services;

import com.edu.bbte.allamvizsga.model.RefreshToken;
import com.edu.bbte.allamvizsga.repository.RefreshTokenRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;

    public void save(RefreshToken refreshToken) {
        refreshTokenRepository.save(refreshToken);
    }
}
