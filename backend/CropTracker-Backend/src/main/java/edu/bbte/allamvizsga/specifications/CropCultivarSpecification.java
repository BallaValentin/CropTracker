package edu.bbte.allamvizsga.specifications;

import edu.bbte.allamvizsga.model.CropCultivar;
import edu.bbte.allamvizsga.model.CropSpecie;
import jakarta.persistence.criteria.Join;
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
        String searchExpression = "%" + pattern.trim() + "%";

        return (root, query, criteriaBuilder) -> {
            Join<CropSpecie, Object> speciesJoin = root.join("cropSpecie");

            return criteriaBuilder.or(
                    criteriaBuilder.like(root.get("cultivarName"), searchExpression),
                    criteriaBuilder.like(speciesJoin.get("commonName"), searchExpression)
            );
        };
    }
}
