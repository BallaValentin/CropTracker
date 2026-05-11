package edu.bbte.allamvizsga.specifications;

import edu.bbte.allamvizsga.model.CropSpecie;
import org.springframework.data.jpa.domain.Specification;

public class CropSpecification {
    public Specification<CropSpecie> byCommonName(String commonName) {
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("commonName"), commonName));
    }

    public Specification<CropSpecie> byCategory(String category) {
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("category"), category));
    }

    public Specification<CropSpecie> byLifecycle(String lifecycle) {
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("lifecycle"), lifecycle));
    }
}
