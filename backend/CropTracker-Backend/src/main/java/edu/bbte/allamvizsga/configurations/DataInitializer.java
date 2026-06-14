package edu.bbte.allamvizsga.configurations;

import edu.bbte.allamvizsga.dto.enums.FieldType;
import edu.bbte.allamvizsga.model.CropCategory;
import edu.bbte.allamvizsga.model.FieldDefinition;
import edu.bbte.allamvizsga.model.Role;
import edu.bbte.allamvizsga.model.WorkType;
import edu.bbte.allamvizsga.repository.CropCategoryRepository;
import edu.bbte.allamvizsga.repository.RoleRepository;
import edu.bbte.allamvizsga.repository.WorkTypesRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collection;
import java.util.List;

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

    @Bean
    public CommandLineRunner initWorkTypes(WorkTypesRepository workTypesRepository) {
        return args -> {

            FieldDefinition tillageType = new FieldDefinition("tillageType", FieldType.SELECT, Boolean.FALSE, List.of("Primary Plowing", "Secondary Conditioning", "Subsoiling", "Strip-Till"));
            FieldDefinition targetDepth = new FieldDefinition("targetDepthCm", FieldType.NUMBER, Boolean.FALSE, List.of());
            Collection<FieldDefinition> tillageFieldDefinitions = List.of(tillageType, targetDepth);
            createWorkTypeIfNotExists(workTypesRepository, "Tillage", tillageFieldDefinitions);

            FieldDefinition quantity = new FieldDefinition("quantity", FieldType.NUMBER, Boolean.FALSE, List.of());
            Collection<FieldDefinition> sowingFieldDefinitions = List.of(quantity);
            createWorkTypeIfNotExists(workTypesRepository, "Sowing", sowingFieldDefinitions);

            FieldDefinition usedFertilizers = new FieldDefinition("usedFertilizers", FieldType.STRINGNUMBER_ARRAY, Boolean.FALSE, List.of());
            FieldDefinition quantityTypes = new FieldDefinition("quantityTypes", FieldType.SELECT, Boolean.FALSE, List.of("g", "kg", "t", "lbs"));
            Collection<FieldDefinition> fertilizationFieldDefinitions = List.of(usedFertilizers, quantityTypes);
            createWorkTypeIfNotExists(workTypesRepository, "Fertilization", fertilizationFieldDefinitions);


            FieldDefinition usedChemicals = new FieldDefinition("usedChemicals", FieldType.STRINGNUMBER_ARRAY, Boolean.FALSE, List.of());
            FieldDefinition chemicalQuantityTypes = new FieldDefinition("chemicalQuantityTypes", FieldType.SELECT, Boolean.FALSE, List.of("ml", "l", "g", "kg", "oz"));
            FieldDefinition carrierVolume = new FieldDefinition("carrierVolume", FieldType.NUMBER, Boolean.FALSE, List.of());
            FieldDefinition carrierVolumeType = new FieldDefinition("carrierVolumeType", FieldType.SELECT, Boolean.FALSE, List.of("l/ha", "gal/acre"));
            Collection<FieldDefinition> sprayingFieldDefinitions = List.of(usedChemicals, chemicalQuantityTypes, carrierVolume, carrierVolumeType);
            createWorkTypeIfNotExists(workTypesRepository, "Spraying", sprayingFieldDefinitions);

            FieldDefinition waterVolume = new FieldDefinition("waterVolume", FieldType.NUMBER, Boolean.FALSE, List.of());
            FieldDefinition waterVolumeType = new FieldDefinition("waterVolumeType", FieldType.SELECT, Boolean.FALSE, List.of("m³", "liters", "mm"));
            Collection<FieldDefinition> irrigationFieldDefinitions = List.of(waterVolume, waterVolumeType);
            createWorkTypeIfNotExists(workTypesRepository, "Irrigation", irrigationFieldDefinitions);

            FieldDefinition observations = new FieldDefinition("observations", FieldType.STRING_ARRAY, Boolean.FALSE, List.of());
            Collection<FieldDefinition> scoutingFieldDefinitions = List.of(observations);
            createWorkTypeIfNotExists(workTypesRepository, "Scouting", scoutingFieldDefinitions);

            FieldDefinition harvestedQuantity = new FieldDefinition("harvestedQuantity", FieldType.NUMBER, Boolean.TRUE, List.of());
            FieldDefinition quantityType = new FieldDefinition("quantityType", FieldType.SELECT, Boolean.FALSE, List.of("g", "kg", "t", "bushels", "bales", "lbs"));
            Collection<FieldDefinition> harvestingFieldDefinitions = List.of(harvestedQuantity, quantityType);
            createWorkTypeIfNotExists(workTypesRepository, "Harvesting", harvestingFieldDefinitions);

            FieldDefinition maintenanceType = new FieldDefinition("maintenanceType", FieldType.STRING, Boolean.FALSE, List.of());
            Collection<FieldDefinition> maintenanceFieldDefinitions = List.of(maintenanceType);
            createWorkTypeIfNotExists(workTypesRepository, "Maintenance", maintenanceFieldDefinitions);

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

    private void createWorkTypeIfNotExists(WorkTypesRepository workTypesRepository, String workTypeName, Collection<FieldDefinition> fieldDefinitions) {
        if (workTypesRepository.findByNameAndIsSystemTrue(workTypeName) == null) {
            WorkType workType = new WorkType(workTypeName, fieldDefinitions);
            workTypesRepository.save(workType);
        }

    }
}
