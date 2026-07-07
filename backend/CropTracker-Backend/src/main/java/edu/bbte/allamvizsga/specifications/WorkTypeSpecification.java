package edu.bbte.allamvizsga.specifications;

import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.model.WorkType;
import org.springframework.data.jpa.domain.Specification;

public class WorkTypeSpecification {
    public static Specification<WorkType> byUser(User user) {
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("user"), user)
        );
    }

    public static Specification<WorkType> withPattern(String pattern) {
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.or(criteriaBuilder.equal(root.get("name"), pattern),
                        criteriaBuilder.like(root.get("name"), "%" + pattern + "%")));
    }

    public static Specification<WorkType> byIsSystem() {
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("isSystem"), Boolean.TRUE)
        );
    }
}
