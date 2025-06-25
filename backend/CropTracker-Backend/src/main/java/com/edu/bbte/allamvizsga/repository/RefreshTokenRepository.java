package com.edu.bbte.allamvizsga.repository;

import com.edu.bbte.allamvizsga.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.rmi.server.UID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UID> {
    public RefreshToken findByToken(String token);
}
