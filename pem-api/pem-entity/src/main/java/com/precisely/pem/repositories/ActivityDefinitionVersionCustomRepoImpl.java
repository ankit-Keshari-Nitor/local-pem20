package com.precisely.pem.repositories;

import com.precisely.pem.enums.Status;
import com.precisely.pem.models.ActivityDefn;
import com.precisely.pem.models.ActivityDefnVersion;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Repository
public class ActivityDefinitionVersionCustomRepoImpl implements ActivityDefinitionVersionCustomRepo{

    private final EntityManager entityManager;

    @Autowired
    ActivityDefinitionVersionCustomRepoImpl(EntityManager entityManager) {
        super();
        this.entityManager = entityManager;
    }
    @Transactional
    public Integer updateActivityDefinitionVersion(Status newStatus,Status oldStatus,String activityDefnKey){
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaUpdate<ActivityDefnVersion> updateCriteria = criteriaBuilder.createCriteriaUpdate(ActivityDefnVersion.class);
        Root<ActivityDefnVersion> root = updateCriteria.from(ActivityDefnVersion.class);

        // Update multiple records using Criteria API
        updateCriteria.set(root.get("status"), newStatus.getStatus());
        updateCriteria.where(
                criteriaBuilder.and(
                        criteriaBuilder.notEqual(root.get("status"), oldStatus.getStatus()),
                        criteriaBuilder.equal(root.get("activityDefnKey"), activityDefnKey)
                )
        );

        return entityManager.createQuery(updateCriteria).executeUpdate();
    }

    @Transactional
    public Integer deleteByActivityDefnKeyAndStatus(String activityDefnKey, String status) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaDelete<ActivityDefnVersion> deleteCriteria = criteriaBuilder.createCriteriaDelete(ActivityDefnVersion.class);
        Root<ActivityDefnVersion> root = deleteCriteria.from(ActivityDefnVersion.class);

        deleteCriteria.where(
                criteriaBuilder.and(
                        criteriaBuilder.equal(root.get("activityDefnKey"), activityDefnKey),
                        criteriaBuilder.equal(root.get("status"), status)
                )
        );

        return entityManager.createQuery(deleteCriteria).executeUpdate();
    }

    @Override
    public Page<ActivityDefnVersion> getAllVersionsList(String activityDefnKey, List<String> status, String sponsorKey, Boolean isDefault, String description, Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<ActivityDefnVersion> query = criteriaBuilder.createQuery(ActivityDefnVersion.class);
        Root<ActivityDefnVersion> root = query.from(ActivityDefnVersion.class);
        Join<ActivityDefnVersion, ActivityDefn> defnJoin = root.join("activityDefn");
        List<Predicate> predicates = buildPredicates(activityDefnKey, description, status, sponsorKey, isDefault, criteriaBuilder, root, defnJoin);
        query.select(root).where(criteriaBuilder.and(predicates.toArray(new Predicate[0])));

        if(pageable.getSort().isSorted()){
            List<Order> orders = new ArrayList<>();
            pageable.getSort().forEach(order -> {
                if(order.isAscending()){
                    orders.add(criteriaBuilder.asc(root.get(order.getProperty())));
                }else{
                    orders.add(criteriaBuilder.desc(root.get(order.getProperty())));
                }
            });
            query.orderBy(orders);
        }

        // Pagination
        TypedQuery<ActivityDefnVersion> typedQuery = entityManager.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());
        List<ActivityDefnVersion> activityDefnList = typedQuery.getResultList();

        // Count query
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<ActivityDefnVersion> countRoot = countQuery.from(ActivityDefnVersion.class);
        Join<ActivityDefnVersion, ActivityDefn> countDefnJoin = countRoot.join("activityDefn");
        List<Predicate> countPredicates = buildPredicates(activityDefnKey, description, status, sponsorKey, isDefault, criteriaBuilder, countRoot, countDefnJoin);
        countQuery.select(criteriaBuilder.count(countRoot)).where(criteriaBuilder.and(countPredicates.toArray(new Predicate[0])));
        Long totalRecords = entityManager.createQuery(countQuery).getSingleResult();
        return new PageImpl<>(activityDefnList, pageable, totalRecords);
    }

    private List<Predicate> buildPredicates(String activityDefnKey, String description, List<String> status,
                                            String sponsorKey, Boolean isDefault, CriteriaBuilder criteriaBuilder,
                                            Root<ActivityDefnVersion> root, Join<ActivityDefnVersion, ActivityDefn> defnJoin) {
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(criteriaBuilder.equal(defnJoin.get("sponsorKey"), sponsorKey));
        predicates.add(root.get("status").in(status));
        predicates.add(criteriaBuilder.equal(root.get("activityDefnKey"),activityDefnKey));
        if (description != null && !description.isEmpty()) {
            predicates.add(criteriaBuilder.like(root.get("description"), "%" + description + "%"));
        }
        if (isDefault != null) {
            predicates.add(criteriaBuilder.equal(root.get("isDefault"), isDefault));
        }
        return predicates;
    }
}
