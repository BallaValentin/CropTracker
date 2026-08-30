package edu.bbte.allamvizsga.configurations;

import edu.bbte.allamvizsga.dto.enums.FieldType;
import edu.bbte.allamvizsga.model.*;
import edu.bbte.allamvizsga.repository.CropCategoryRepository;
import edu.bbte.allamvizsga.repository.RoleRepository;
import edu.bbte.allamvizsga.repository.WorkTypesRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
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

            Collection<OptionType> tillageOptions = new ArrayList<>();
            tillageOptions.add(new OptionType("Primary Plowing", 1));
            tillageOptions.add(new OptionType("Secondary Conditioning", 1));
            tillageOptions.add(new OptionType("Subsoiling", 1));
            tillageOptions.add(new OptionType("Strip-Till", 1));

            FieldDefinition tillageType = new FieldDefinition("tillageType", FieldType.SELECT, Boolean.FALSE, Boolean.FALSE, tillageOptions);
            FieldDefinition targetDepth = new FieldDefinition("targetDepthCm", FieldType.NUMBER, Boolean.FALSE, Boolean.FALSE, List.of());
            Collection<FieldDefinition> tillageFieldDefinitions = List.of(tillageType, targetDepth);
            createWorkTypeIfNotExists(workTypesRepository, "Tillage", tillageFieldDefinitions);

            FieldDefinition quantity = new FieldDefinition("quantity", FieldType.NUMBER, Boolean.FALSE, Boolean.FALSE, List.of());
            Collection<FieldDefinition> sowingFieldDefinitions = List.of(quantity);
            createWorkTypeIfNotExists(workTypesRepository, "Sowing", sowingFieldDefinitions);

            Collection<OptionType> usedFertilizerOptions = new ArrayList<>();
            usedFertilizerOptions.add(new OptionType("g", 0.001));
            usedFertilizerOptions.add(new OptionType("kg", 1));
            usedFertilizerOptions.add(new OptionType("t", 1000));
            usedFertilizerOptions.add(new OptionType("lbs", 0.4536));

            FieldDefinition usedFertilizers = new FieldDefinition("usedFertilizers", FieldType.STRINGNUMBER_ARRAY, Boolean.FALSE, Boolean.TRUE, usedFertilizerOptions);
            Collection<FieldDefinition> fertilizationFieldDefinitions = List.of(usedFertilizers);
            createWorkTypeIfNotExists(workTypesRepository, "Fertilization", fertilizationFieldDefinitions);

            Collection<OptionType> chemicalOptions = new ArrayList<>();
            chemicalOptions.add(new OptionType("ml", 0.001));
            chemicalOptions.add(new OptionType("l", 1));
            chemicalOptions.add(new OptionType("g", 0.001));
            chemicalOptions.add(new OptionType("kg", 1));
            chemicalOptions.add(new OptionType("oz", 0.02957));

            Collection<OptionType> carrierVolumeOptions = new ArrayList<>();
            carrierVolumeOptions.add(new OptionType("l/ha", 1));
            carrierVolumeOptions.add(new OptionType("gal/acre", 0.1069));


            FieldDefinition usedChemicals = new FieldDefinition("usedChemicals", FieldType.STRINGNUMBER_ARRAY, Boolean.FALSE, Boolean.TRUE, chemicalOptions);
            FieldDefinition carrierVolume = new FieldDefinition("carrierVolume", FieldType.NUMBER, Boolean.FALSE, Boolean.TRUE, carrierVolumeOptions);
            Collection<FieldDefinition> sprayingFieldDefinitions = List.of(usedChemicals, carrierVolume);
            createWorkTypeIfNotExists(workTypesRepository, "Spraying", sprayingFieldDefinitions);

            Collection<OptionType> waterVolumeOptions = new ArrayList<>();
            waterVolumeOptions.add(new OptionType("m3", 1000));
            waterVolumeOptions.add(new OptionType("l", 1));

            FieldDefinition waterVolume = new FieldDefinition("waterVolume", FieldType.NUMBER, Boolean.FALSE, Boolean.TRUE, waterVolumeOptions);
            Collection<FieldDefinition> irrigationFieldDefinitions = List.of(waterVolume);
            createWorkTypeIfNotExists(workTypesRepository, "Irrigation", irrigationFieldDefinitions);

            FieldDefinition observations = new FieldDefinition("observations", FieldType.STRING_ARRAY, Boolean.FALSE, Boolean.FALSE, List.of());
            Collection<FieldDefinition> scoutingFieldDefinitions = List.of(observations);
            createWorkTypeIfNotExists(workTypesRepository, "Scouting", scoutingFieldDefinitions);

            Collection<OptionType> harvestedQuantityOptions = new ArrayList<>();
            harvestedQuantityOptions.add(new OptionType("g", 0.001));
            harvestedQuantityOptions.add(new OptionType("kg", 1));
            harvestedQuantityOptions.add(new OptionType("t", 1000));
            harvestedQuantityOptions.add(new OptionType("lbs", 0.4536));

            FieldDefinition harvestedQuantity = new FieldDefinition("harvestedQuantity", FieldType.NUMBER, Boolean.TRUE, Boolean.TRUE, harvestedQuantityOptions);
            Collection<FieldDefinition> harvestingFieldDefinitions = List.of(harvestedQuantity);
            createWorkTypeIfNotExists(workTypesRepository, "Harvesting", harvestingFieldDefinitions);

            FieldDefinition maintenanceType = new FieldDefinition("maintenanceType", FieldType.STRING, Boolean.FALSE, Boolean.FALSE, List.of());
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
