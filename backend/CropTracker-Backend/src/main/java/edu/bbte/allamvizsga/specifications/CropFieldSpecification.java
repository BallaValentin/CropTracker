package edu.bbte.allamvizsga.specifications;

import edu.bbte.allamvizsga.model.CropField;
import edu.bbte.allamvizsga.model.User;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public class CropFieldSpecification {
    public static Specification<CropField> withNamePattern(String baseName) {
        return (((root, query, criteriaBuilder) ->
                criteriaBuilder.or(
                        criteriaBuilder.equal(root.get("name"), baseName),
                        criteriaBuilder.like(root.get("name"), "%" + baseName + "%"))))
                ;
    }

    public static Specification<CropField> byUser(User user) {
        return (((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("user"), user)));
    }

    public static Specification<CropField> notDeleted() {
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("isDeleted"), Boolean.FALSE));
    }

    public static Specification<CropField> notWithId(UUID cropFieldId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.notEqual(root.get("uid"), cropFieldId);
    }
}
