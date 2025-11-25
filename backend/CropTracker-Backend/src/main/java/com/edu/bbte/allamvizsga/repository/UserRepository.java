package com.edu.bbte.allamvizsga.repository;

import com.edu.bbte.allamvizsga.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.rmi.server.UID;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UID> {
    User findByUid(UUID uid);
    User findByUsername(String username);
    User findByEmail(String email);
    @Transactional
    @Modifying
    @Query("update User u set u.username = :username where u.uid = :userID")
    void updateUsername(String username, UUID userID);
    @Transactional
    @Modifying
    @Query("update User u set u.email = :username where u.uid = :userID")
    void updateEmail(String email, UUID userID);
    @Transactional
    @Modifying
    @Query("update User u set u.password = :password where u.uid = :userID")
    void updatePassword(String password, UUID userID);
    @Transactional
    @Modifying
    @Query("update User u set u.isActive = :isActive where u.uid = :userID")
    void updateStatus(Boolean isActive, UUID userID);
}
