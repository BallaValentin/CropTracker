package edu.bbte.allamvizsga.specifications;

import edu.bbte.allamvizsga.model.CropFieldVersion;
import edu.bbte.allamvizsga.model.FieldParcelVersion;
import org.springframework.data.jpa.domain.Specification;

public class FieldParcelVersionSpecification {
    public static Specification<FieldParcelVersion> byCropFieldVersion(CropFieldVersion cropFieldVersion) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("cropFieldVersion"), cropFieldVersion);
    }
}
