package edu.bbte.allamvizsga.repository;

import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.model.VerifyEmailToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface VerifyEmailTokenRepository extends JpaRepository<VerifyEmailToken, UUID> {
    VerifyEmailToken findByUser(User user);

    VerifyEmailToken findByVerificationCode(String verificationCode);

    void deleteByUser(User user);
}
