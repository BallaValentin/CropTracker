package edu.bbte.allamvizsga.specifications;

import edu.bbte.allamvizsga.model.CropCultivar;
import edu.bbte.allamvizsga.model.CropSpecie;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.MapJoin;
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

    public static Specification<CropCultivar> withPattern(String pattern, String language) {
        String searchExpression = "%" + pattern.trim() + "%";

        return (root, query, criteriaBuilder) -> {
            Join<CropSpecie, Object> speciesJoin = root.join("cropSpecie");

            Expression<String> jsonLang = criteriaBuilder.function(
                    "JSON_UNQUOTE",
                    String.class,
                    criteriaBuilder.function(
                            "JSON_EXTRACT",
                            String.class,
                            speciesJoin.get("commonName"),
                            criteriaBuilder.literal("$." + language)
                    )
            );

            Expression<String> nullIfEmptyLang = criteriaBuilder.function(
                    "NULLIF",
                    String.class,
                    jsonLang,
                    criteriaBuilder.literal("")
            );

            Expression<String> jsonEnFallback = criteriaBuilder.function(
                    "JSON_UNQUOTE",
                    String.class,
                    criteriaBuilder.function(
                            "JSON_EXTRACT",
                            String.class,
                            speciesJoin.get("commonName"),
                            criteriaBuilder.literal("$.en")
                    )
            );

            Expression<String> effectiveCommonName = criteriaBuilder.coalesce(nullIfEmptyLang, jsonEnFallback);

            return criteriaBuilder.or(
                    criteriaBuilder.like(root.get("cultivarName"), searchExpression),
                            criteriaBuilder.like(criteriaBuilder.lower(effectiveCommonName), searchExpression.toLowerCase())
                );
        };
    }
}
