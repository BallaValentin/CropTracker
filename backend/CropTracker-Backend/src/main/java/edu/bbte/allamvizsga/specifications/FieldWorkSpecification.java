package edu.bbte.allamvizsga.specifications;

import edu.bbte.allamvizsga.model.CropField;
import edu.bbte.allamvizsga.model.FieldWork;
import edu.bbte.allamvizsga.model.WorkType;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class FieldWorkSpecification {
    public static Specification<FieldWork> byCropField(CropField cropField) {
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("cropField"), cropField));
    }

    public static Specification<FieldWork> withStartDateGreaterThanEqual(Instant startDate) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("startDate"), startDate);
    }

    public static Specification<FieldWork> byWorkTypeIn(List<UUID> selectedWorkTypes) {
        return (root, query, criteriaBuilder) -> {
            if (selectedWorkTypes == null || selectedWorkTypes.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            Join<WorkType, Object> workTypesJoin = root.join("workTypes");
            return workTypesJoin.get("uid").in(selectedWorkTypes);
        };
    }

    public static Specification<FieldWork> byWorkTiming(String workTiming) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(
                root.get("workTiming"), workTiming
        );
    }
}
