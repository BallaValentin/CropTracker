package edu.bbte.allamvizsga.specifications;

import edu.bbte.allamvizsga.model.CropCategory;
import edu.bbte.allamvizsga.model.CropSpecie;
import org.springframework.data.jpa.domain.Specification;

public class CropSpecieSpecification {
    public static Specification<CropSpecie> byCategory(CropCategory cropCategory) {
        return (((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("cropCategory"), cropCategory)));
    }

    public static Specification<CropSpecie> withPattern(String pattern) {
        return (((root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("commonName"), "%" + pattern + "%")));
    }
}
