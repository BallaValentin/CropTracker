package edu.bbte.allamvizsga.repository;

import org.springframework.data.domain.ScrollPosition;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Window;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ScrollableSpecificationExecutor<T> extends JpaSpecificationExecutor<T> {
    default Window<T> scrollAll(Specification<T> specification, ScrollPosition scrollPosition, int limit, String sortProperty) {
        return findBy(specification, query -> query.limit(limit).sortBy(Sort.by(sortProperty).descending())
                .scroll(scrollPosition));
    }
}
