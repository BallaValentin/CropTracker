package edu.bbte.allamvizsga.specifications;

import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.model.WorkTypes;
import org.springframework.data.jpa.domain.Specification;

public class WorkTypesSpecification {
    public static Specification<WorkTypes> byUser(User user) {
        return ((root, query, criteriaBuilder) ->
            criteriaBuilder.equal(root.get("user"), user)
        );
    }

    public static Specification<WorkTypes> byIsSystem() {
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("isSystem"), Boolean.TRUE)
        );
    }
}
