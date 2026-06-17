package edu.bbte.allamvizsga.repository;

import edu.bbte.allamvizsga.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.rmi.server.UID;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UID> {
    public RefreshToken findByToken(UUID token);

    void deleteByUid(UUID uid);
}
