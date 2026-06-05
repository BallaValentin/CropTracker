package edu.bbte.allamvizsga.specifications;

import edu.bbte.allamvizsga.model.CropField;
import edu.bbte.allamvizsga.model.FieldWork;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;

public class FieldWorkSpecification {
    public static Specification<FieldWork> byCropField(CropField cropField) {
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("cropField"), cropField));
    }

    public static Specification<FieldWork> withStartDateGreaterThanEqual(Instant startDate) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("startDate"), startDate);
    }
}
