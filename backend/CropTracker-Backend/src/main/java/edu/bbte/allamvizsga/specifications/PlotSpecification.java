package edu.bbte.allamvizsga.specifications;

import edu.bbte.allamvizsga.model.Plot;
import edu.bbte.allamvizsga.model.User;
import org.springframework.data.jpa.domain.Specification;

public class PlotSpecification {
    public static Specification<Plot> byUser(User user) {
        return (((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("user"), user)));
    }

    public static Specification<Plot> notDeleted() {
        return ((root, query, criteriaBuilder) ->
            criteriaBuilder.equal(root.get("isDeleted"), Boolean.FALSE));
    }
}
