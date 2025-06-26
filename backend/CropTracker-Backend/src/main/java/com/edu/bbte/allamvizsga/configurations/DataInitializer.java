package com.edu.bbte.allamvizsga.configurations;
import com.edu.bbte.allamvizsga.model.Role;
import com.edu.bbte.allamvizsga.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
    @Bean
    public CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            createRoleIfNotExist(roleRepository, "ADMIN");
            createRoleIfNotExist(roleRepository, "USER");
        };
    }

    private void createRoleIfNotExist(RoleRepository roleRepository, String role) {
        if (roleRepository.findByName(role).isEmpty()) {
            Role newRole = new Role(role);
            roleRepository.save(newRole);
        }
    }
}
