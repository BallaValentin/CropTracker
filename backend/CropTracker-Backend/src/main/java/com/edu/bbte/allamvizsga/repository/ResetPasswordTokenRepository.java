package com.edu.bbte.allamvizsga.repository;

import com.edu.bbte.allamvizsga.model.ResetPasswordToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.rmi.server.UID;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResetPasswordTokenRepository extends JpaRepository<ResetPasswordToken, UID> {
    Optional<ResetPasswordToken> findByUid(UUID uid);
}
