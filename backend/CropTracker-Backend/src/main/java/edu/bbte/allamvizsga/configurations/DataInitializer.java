package edu.bbte.allamvizsga.configurations;

import edu.bbte.allamvizsga.model.CropCategory;
import edu.bbte.allamvizsga.model.Role;
import edu.bbte.allamvizsga.repository.CropCategoryRepository;
import edu.bbte.allamvizsga.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
    @Bean
    public CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            createRoleIfNotExist(roleRepository, "ADMIN");
            createRoleIfNotExist(roleRepository, "GROWER");
            createRoleIfNotExist(roleRepository, "WORKER");
        };
    }

    @Bean
    public CommandLineRunner initCropCategories(CropCategoryRepository cropCategoryRepository) {
        return args -> {
            createCropCategoryIfNotExist(cropCategoryRepository, "Grains");
            createCropCategoryIfNotExist(cropCategoryRepository, "Oilseeds");
            createCropCategoryIfNotExist(cropCategoryRepository, "Legumes");
            createCropCategoryIfNotExist(cropCategoryRepository, "Vegetables");
            createCropCategoryIfNotExist(cropCategoryRepository, "Fruits");

        };
    }

    private void createRoleIfNotExist(RoleRepository roleRepository, String role) {
        if (roleRepository.findByName(role).isEmpty()) {
            Role newRole = new Role(role);
            roleRepository.save(newRole);
        }
    }

    private void createCropCategoryIfNotExist(CropCategoryRepository ccRepository, String categoryName) {
        if (ccRepository.findByCategoryName(categoryName) == null) {
            CropCategory cropCategory = new CropCategory(categoryName);
            ccRepository.save(cropCategory);

        }
    }
}
