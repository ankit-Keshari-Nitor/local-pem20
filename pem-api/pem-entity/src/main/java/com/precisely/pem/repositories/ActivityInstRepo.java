package com.precisely.pem.repositories;

import com.precisely.pem.models.ActivityInst;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityInstRepo extends JpaRepository<ActivityInst,String> {
    ActivityInst findByActivityDefnVersionKey(String activityDefnVersionKey);
    Page<ActivityInst> findBySponsorKeyAndNameContainingAndDescriptionContainingAndActivityDefnVersionKeyAndStatus(String sponsorKey, String conName, String description, String activityDefnVersionKey, String status, Pageable pageable);

    Page<ActivityInst> findBySponsorKeyAndNameAndDescriptionContainingAndActivityDefnVersionKeyAndStatus(String sponsorKey, String name, String description, String activityDefnVersionKey, String status, Pageable pageable);

    Page<ActivityInst> findBySponsorKeyAndNameContainingAndStatusAndAndActivityDefnVersionKey(String sponsorKey, String conName, String status, String activityDefnVersionKey, Pageable pageable);

    Page<ActivityInst> findBySponsorKeyAndNameAndStatusAndAndActivityDefnVersionKey(String sponsorKey, String name, String status, String activityDefnVersionKey, Pageable pageable);

    Page<ActivityInst> findBySponsorKeyAndDescriptionContainingAndActivityDefnVersionKeyAndStatus(String sponsorKey, String description, String activityDefnVersionKey, String status, Pageable pageable);

    Page<ActivityInst> findBySponsorKeyAndActivityDefnVersionKeyAndStatus(String sponsorKey, String activityDefnVersionKey, String status, Pageable pageable);

    ActivityInst findByActivityInstKey(String activityInstKey);

    Page<ActivityInst> findBySponsorKeyAndDescriptionContainingAndStatus(String sponsorKey, String description, String status, Pageable pageable);

    Page<ActivityInst> findBySponsorKeyAndNameContainingAndStatus(String sponsorKey, String conName, String status, Pageable pageable);

    Page<ActivityInst> findBySponsorKeyAndNameAndStatus(String sponsorKey, String name, String status, Pageable pageable);

    Page<ActivityInst> findBySponsorKeyAndStatus(String sponsorKey, String status, Pageable pageable);
}
