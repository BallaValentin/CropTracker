package com.edu.bbte.allamvizsga.repository;

import com.edu.bbte.allamvizsga.model.Plot;
import com.edu.bbte.allamvizsga.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.rmi.server.UID;
import java.util.Collection;
import java.util.UUID;

@Repository
public interface PlotRepository extends JpaRepository<Plot, UID> {
    Collection<Plot> findAllByUser(User user);
    Plot findByUid(UUID uid);
}
