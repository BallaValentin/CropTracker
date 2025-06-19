package com.edu.bbte.allamvizsga.repository;

import com.edu.bbte.allamvizsga.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.rmi.server.UID;

public interface UserRepository extends JpaRepository<User, UID> {
}
