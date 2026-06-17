package edu.bbte.allamvizsga.services;

import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.model.VerifyEmailToken;
import edu.bbte.allamvizsga.repository.UserRepository;
import edu.bbte.allamvizsga.repository.VerifyEmailTokenRepository;
import edu.bbte.allamvizsga.util.JwtUtil;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class VerifyEmailTokenService {
    private final VerifyEmailTokenRepository verifyEmailTokenRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final SecureRandom secureRandom = new SecureRandom();

    protected VerifyEmailToken generateVerificationCode(VerifyEmailToken verifyEmailToken) {
        int tryCount = 0;
        int maxTries = 5;

        while (tryCount < maxTries) {
            String generatedCode = String.format("%06d", secureRandom.nextInt(1000000));
            verifyEmailToken.setVerificationCode(generatedCode);
            try {
                verifyEmailTokenRepository.save(verifyEmailToken);
                return verifyEmailToken;
            } catch (DataIntegrityViolationException exception) {
                ++tryCount;
            }
        }

        throw new RuntimeException("System was unable to generate a unique code. Please try again.");
    }

    public VerifyEmailToken createToken(User user) {

        VerifyEmailToken oldToken = verifyEmailTokenRepository.findByUser(user);

        if (oldToken != null) {
            verifyEmailTokenRepository.deleteById(oldToken.getUid());
        }

        String tokenText = jwtUtil.generateEmailToken(user.getEmail());
        VerifyEmailToken verifyEmailToken = new VerifyEmailToken(user, tokenText);
        verifyEmailTokenRepository.save(verifyEmailToken);

        return generateVerificationCode(verifyEmailToken);
    }

    public void deleteByUser(User user) {
        verifyEmailTokenRepository.deleteByUser(user);
    }
}
