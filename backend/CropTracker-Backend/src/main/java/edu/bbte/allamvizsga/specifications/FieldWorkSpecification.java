package edu.bbte.allamvizsga.specifications;

import edu.bbte.allamvizsga.model.*;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

public class FieldWorkSpecification {
    public static Specification<FieldWork> byCropField(CropField cropField) {
        return ((root, query, criteriaBuilder) ->
        {
            if (cropField == null) {
                return criteriaBuilder.conjunction();
            } else {
                Join<CropFieldVersion, Object> cropFieldVersionJoin =
                        root.join("cropFieldVersion");
                return cropFieldVersionJoin.get("cropField").equalTo(cropField);
            }
        });
    }

    public static Specification<FieldWork> byCropFieldCollection(Collection<CropField> cropFields) {
        return ((root, query, criteriaBuilder) ->
        {
            if (cropFields.isEmpty()) {
                return criteriaBuilder.disjunction();
            } else {
                Join<CropFieldVersion, Object> cropFieldVersionJoin =
                        root.join("cropFieldVersion");
                return cropFieldVersionJoin.get("cropField").in(cropFields);
            }
        });
    }

    public static Specification<FieldWork> byCropFieldVersion(CropFieldVersion cropFieldVersion) {
        return ((root, query, criteriaBuilder) ->
        {
            if (cropFieldVersion == null) {
                return criteriaBuilder.conjunction();
            } else {
                return criteriaBuilder.equal(root.get("cropFieldVersion"), cropFieldVersion);
            }
        });
    }

    public static Specification<FieldWork> withStartDateGreaterThanOrEqual(OffsetDateTime startDate) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("startDate"), startDate);
    }

    public static Specification<FieldWork> byWorkTypeIn(List<UUID> selectedWorkTypes) {
        return (root, query, criteriaBuilder) -> {
            if (selectedWorkTypes == null || selectedWorkTypes.isEmpty()) {
                return criteriaBuilder.disjunction();
            }
            Join<WorkType, Object> workTypesJoin = root.join("workType");
            return workTypesJoin.get("uid").in(selectedWorkTypes);
        };
    }

    public static Specification<FieldWork> byUser(User user) {
        return (root, query, criteriaBuilder) -> {
            Join<FieldWork, CropFieldVersion> cropFieldVersionJoin =
                    root.join("cropFieldVersion");
            Join<CropFieldVersion, CropField> cropFieldJoin =
                    cropFieldVersionJoin.join("cropField");
            return cropFieldJoin.get("user").equalTo(user);
        };
    }

    public static Specification<FieldWork> byWorkTiming(String workTiming) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(
                root.get("workTiming"), workTiming
        );
    }

    public static Specification<FieldWork> byWorkTypeCollection(Collection<WorkType> workTypes) {
        return ((root, query, criteriaBuilder) -> {
            if (workTypes.isEmpty()) {
                return criteriaBuilder.disjunction();
            } else {
                return root.get("workType").in(workTypes);
            }
        });
    }

    public static Specification<FieldWork> byIsActive() {
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("isActive"), Boolean.TRUE));
    }

    public static Specification<FieldWork> byStartDateBefore(OffsetDateTime offsetDateTime) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.lessThan(root.get("startDate"), offsetDateTime);
    }

    public static Specification<FieldWork> byStartDateAfter(OffsetDateTime offsetDateTime) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("startDate"), offsetDateTime);
    }
}
