package com.edu.bbte.allamvizsga.repository;

import com.edu.bbte.allamvizsga.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.rmi.server.UID;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, UID> {
    Optional<Role> findByName(String name);
}
