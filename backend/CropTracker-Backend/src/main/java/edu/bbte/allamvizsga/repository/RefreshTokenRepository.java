package edu.bbte.allamvizsga.repository;

import edu.bbte.allamvizsga.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    public RefreshToken findByToken(String token);
}
