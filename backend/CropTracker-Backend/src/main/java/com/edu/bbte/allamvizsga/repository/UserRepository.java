package com.edu.bbte.allamvizsga.repository;

import com.edu.bbte.allamvizsga.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.rmi.server.UID;

@Repository
public interface UserRepository extends JpaRepository<User, UID> {
    User getUserByUid(UID uid);
    User getUserByUsername(String username);
}
