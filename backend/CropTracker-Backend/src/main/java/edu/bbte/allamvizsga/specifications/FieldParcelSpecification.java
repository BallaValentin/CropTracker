package edu.bbte.allamvizsga.specifications;

import edu.bbte.allamvizsga.model.CropField;
import edu.bbte.allamvizsga.model.FieldParcel;
import org.springframework.data.jpa.domain.Specification;

public class FieldParcelSpecification {
    public static Specification<FieldParcel> withNamePattern(String baseName) {
        return ((root, query, criteriaBuilder) ->
            criteriaBuilder.or(criteriaBuilder.equal(root.get("name"), baseName),
                    criteriaBuilder.equal(root.get("name"), baseName + "(%)")));

        };

    public static Specification<FieldParcel> byCropField(CropField cropField) {
        return (((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("cropField"), cropField)));
    }
    }
