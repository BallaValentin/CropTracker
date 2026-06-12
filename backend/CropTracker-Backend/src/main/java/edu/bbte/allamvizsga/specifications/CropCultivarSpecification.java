package edu.bbte.allamvizsga.specifications;

import edu.bbte.allamvizsga.model.CropCultivar;
import edu.bbte.allamvizsga.model.CropSpecie;
import org.springframework.data.jpa.domain.Specification;

public class CropCultivarSpecification {
    public static Specification<CropCultivar> inSpecie(CropSpecie cropSpecie) {
        return (((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("cropSpecie"), cropSpecie)));
    }

    public static Specification<CropCultivar> withCultivarName(String cultivarName) {
        return (((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("cultivarName"), cultivarName)));
    }

    public static Specification<CropCultivar> withPattern(String pattern) {
        return (((root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("cultivarName"), "%" + pattern + "%")));
    }
}
