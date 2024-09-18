package com.precisely.pem.repositories;

import com.precisely.pem.dtos.requests.UserRequest;
import com.precisely.pem.dtos.responses.UserResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class ParticipantCustomRepoImpl implements ParticipantCustomRepo {

    private final EntityManager entityManager;

    @Autowired
    ParticipantCustomRepoImpl(EntityManager entityManager) {
        super();
        this.entityManager = entityManager;
    }
    @Override
    public Page<UserResponse> findUsers(UserRequest userRequest, Pageable pageable) {

        String selectQuery = getSelectQuery();
        String fromQuery = getFromQuery();
        String whereQuery = getWhereQuery(userRequest);

        String queryStr = selectQuery+fromQuery+whereQuery;

        TypedQuery<UserResponse> userResponseTypedQuery = entityManager.createQuery(queryStr,UserResponse.class);
        addFilterValue(userRequest, userResponseTypedQuery);

        // Adding sorting functionality
        appendSortingFilter(pageable, queryStr);

        // Apply pagination
        userResponseTypedQuery.setFirstResult((int) pageable.getOffset());
        userResponseTypedQuery.setMaxResults(pageable.getPageSize());

        List<UserResponse> userResponses = userResponseTypedQuery.getResultList();

        // Create a count query for total records
        String countQueryStr = "SELECT COUNT(participant) " + fromQuery + whereQuery;

        TypedQuery<Long> countQuery = entityManager.createQuery(countQueryStr, Long.class);
        appendFiltersForCount(userRequest,countQuery);

        Long totalRecords = countQuery.getSingleResult();

        return new PageImpl<>(userResponses, pageable, totalRecords);
    }

    private String getWhereQuery(UserRequest userRequest) {
        String where = "WHERE participant.sponsorKey = LOWER(:sponsorKey) " +
                " AND participant.participantStatus = 'APPROVED' " +
                " AND (:partnerKey IS NULL OR participant.partnerKey = LOWER(:partnerKey))" +
                " AND (:userKey IS NULL OR participant.participantKey = LOWER(:userKey))" +
                " AND (:participantRole IS NULL OR participant.participantRole = LOWER(:participantRole))" +
                " AND (:externalId IS NULL OR participant.externalId = LOWER(:externalId))" +
                " AND (:participantStatus IS NULL OR participant.participantStatus = LOWER(:participantStatus))" ;

        String userName = " AND (:userName IS NULL OR companyUser.userName = LOWER(:userName))";
        if (userRequest.getUserName() != null && !userRequest.getUserName().isEmpty()) {
            if (userRequest.getUserName().contains("con:")) {
                userRequest.setUserName(userRequest.getUserName().replace("con:", ""));
                userName = " AND (:userName IS NULL OR LOWER(companyUser.userName) LIKE LOWER(CONCAT('%', :userName, '%'))) ";
            }
        }
        String firstName = " AND (:firstName IS NULL OR companyUser.firstName = LOWER(:firstName))";
        if (userRequest.getFirstName() != null && !userRequest.getFirstName().isEmpty()) {
            if (userRequest.getFirstName().contains("con:")) {
                userRequest.setFirstName(userRequest.getFirstName().replace("con:", ""));
                firstName = " AND (:firstName IS NULL OR LOWER(companyUser.firstName) LIKE LOWER(CONCAT('%', :firstName, '%'))) ";
            }
        }
        String lastName = " AND (:lastName IS NULL OR companyUser.lastName = LOWER(:lastName))";
        if (userRequest.getLastName() != null && !userRequest.getLastName().isEmpty()) {
            if (userRequest.getLastName().contains("con:")) {
                userRequest.setLastName(userRequest.getLastName().replace("con:", ""));
                lastName = " AND (:lastName IS NULL OR LOWER(companyUser.lastName) LIKE LOWER(CONCAT('%', :lastName, '%'))) ";
            }
        }
        String email = " AND (:email IS NULL OR companyUser.email = LOWER(:email))";
        if (userRequest.getEmail() != null && !userRequest.getEmail().isEmpty()) {
            if (userRequest.getEmail().contains("con:")) {
                userRequest.setEmail(userRequest.getEmail().replace("con:", ""));
                email = " AND (:email IS NULL OR LOWER(companyUser.email) LIKE LOWER(CONCAT('%', :email, '%'))) ";
            }
        }

        return where + userName + firstName + lastName + email;
    }

    private String getFromQuery() {
        return "FROM CompanyUser companyUser " +
                "INNER JOIN Participant participant ON participant.companyUserKey = companyUser.companyUserKey ";
    }

    private String getSelectQuery() {
        return "SELECT new com.precisely.pem.dtos.responses.UserResponse(" +
                "companyUser.email, companyUser.firstName, companyUser.lastName, " +
                "'-', participant.participantKey, companyUser.userName, " +
                "participant.participantStatus) ";
    }

    private void appendSortingFilter(Pageable pageable, String queryStr) {
        if (pageable.getSort().isSorted()) {
            queryStr += " ORDER BY ";
            queryStr += pageable.getSort().stream()
                    .map(order -> "companyUser." + order.getProperty() + " " + order.getDirection())
                    .collect(Collectors.joining(", "));
        }
    }

    private void addFilterValue(UserRequest userRequest, TypedQuery<UserResponse> query) {
        query.setParameter("sponsorKey", userRequest.getSponsorKey());
        query.setParameter("partnerKey", userRequest.getPartnerKey());
        query.setParameter("userKey", userRequest.getUserKey());
        query.setParameter("userName", userRequest.getUserName());
        query.setParameter("firstName", userRequest.getFirstName());
        query.setParameter("lastName", userRequest.getLastName());
        query.setParameter("email", userRequest.getEmail());
        query.setParameter("participantRole", userRequest.getParticipantRole());
        query.setParameter("externalId", userRequest.getUserExternalId());
        query.setParameter("participantStatus", userRequest.getParticipantStatus());
    }

    private void appendFiltersForCount(UserRequest userRequest, TypedQuery<Long> longTypedQuery) {
        longTypedQuery.setParameter("sponsorKey", userRequest.getSponsorKey());
        longTypedQuery.setParameter("partnerKey", userRequest.getPartnerKey());
        longTypedQuery.setParameter("userKey", userRequest.getUserKey());
        longTypedQuery.setParameter("userName", userRequest.getUserName());
        longTypedQuery.setParameter("firstName", userRequest.getFirstName());
        longTypedQuery.setParameter("lastName", userRequest.getLastName());
        longTypedQuery.setParameter("email", userRequest.getEmail());
        longTypedQuery.setParameter("participantRole", userRequest.getParticipantRole());
        longTypedQuery.setParameter("externalId", userRequest.getUserExternalId());
        longTypedQuery.setParameter("participantStatus", userRequest.getParticipantStatus());
    }
}
