package com.precisely.pem.repositories;

import com.precisely.pem.models.PcptActivityInst;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PcptInstRepo extends JpaRepository<PcptActivityInst,String> {
    PcptActivityInst findBySponsorKeyAndPcptActivityInstKey(String sponsorKey,String pcptActivityInstKey);

    Page<PcptActivityInst> findBySponsorKeyAndActivityInstKey(String sponsorKey,String activityInstKey, Pageable pageable);

    @Query(value = "SELECT pa FROM PcptActivityInst pa " +
            "WHERE pa.sponsorKey = :sponsorKey " +
            "AND pa.activityInstKey = :activityInstKey " +
            "AND pa.dueDate < ':currentDate'", nativeQuery = true)
    Page<PcptActivityInst> findBySponsorKeyAndActivityInstKeyAndDelayedProgress(@Param("sponsorKey") String sponsorKey,@Param("activityInstKey") String activityInstKey,
                                                                                                 @Param("currentDate") String currentDate,Pageable pageable);

    @Query(value = "SELECT pa FROM PcptActivityInst pa " +
            "WHERE pa.sponsorKey = :sponsorKey " +
            "AND pa.activityInstKey = :activityInstKey " +
            "AND pa.dueDate >= ':currentDate'",nativeQuery = true)
    Page<PcptActivityInst> findBySponsorKeyAndActivityInstKeyAndOnScheduleProgress(@Param("sponsorKey") String sponsorKey,@Param("activityInstKey") String activityInstKey,
                                                                                                    @Param("currentDate") String currentDate,Pageable pageable);


    Page<PcptActivityInst> findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndCurrentTask(String sponsorKey,String activityInstKey,String status,
                                                                                                 String currentTask,Pageable pageable);

    Page<PcptActivityInst> findBySponsorKeyAndActivityInstKeyAndPcptInstStatus(String sponsorKey,String activityInstKey, String status, Pageable pageable);

    @Query(value = "SELECT pa FROM PcptActivityInst pa " +
            "WHERE pa.sponsorKey = :sponsorKey " +
            "AND pa.activityInstKey = :activityInstKey " +
            "AND pa.pcptInstStatus = :status " +
            "AND pa.dueDate < ':currentDate'", nativeQuery = true)
    Page<PcptActivityInst> findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndDelayedProgress(@Param("sponsorKey") String sponsorKey,@Param("activityInstKey") String activityInstKey,
                                                                                                               @Param("status") String status,
                                                                                                               @Param("currentDate") String currentDate,Pageable pageable);

    @Query(value = "SELECT pa FROM PcptActivityInst pa " +
            "WHERE pa.sponsorKey = :sponsorKey " +
            "AND pa.activityInstKey = :activityInstKey " +
            "AND pa.pcptInstStatus = :status " +
            "AND pa.dueDate >= ':currentDate'", nativeQuery = true)
    Page<PcptActivityInst> findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndOnScheduleProgress(@Param("sponsorKey") String sponsorKey,@Param("activityInstKey") String activityInstKey,
                                                                                                                  @Param("status") String status,
                                                                                                                  @Param("currentDate") String currentDate,Pageable pageable);

    @Query(value = "SELECT pa FROM PcptActivityInst pa " +
            "INNER JOIN Partners p ON pa.partnerKey = p.partnerKey " +
            "INNER JOIN Company c ON p.companyKey = c.companyKey " +
            "WHERE pa.sponsorKey = :sponsorKey " +
            "AND pa.activityInstKey = :activityInstKey " +
            "AND pa.pcptInstStatus = :status " +
            "AND c.companyName LIKE %:partnerName%",nativeQuery = true)
    Page<PcptActivityInst> findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndPartnerName(@Param("sponsorKey") String sponsorKey,@Param("activityInstKey") String activityInstKey,
                                                                                             @Param("status") String status,@Param("partnerName") String partnerName, Pageable pageable);

    @Query(value = "SELECT pa FROM PcptActivityInst pa " +
            "INNER JOIN Partners p ON pa.partnerKey = p.partnerKey " +
            "INNER JOIN Company c ON p.companyKey = c.companyKey " +
            "WHERE pa.sponsorKey = :sponsorKey " +
            "AND pa.activityInstKey = :activityInstKey " +
            "AND pa.pcptInstStatus = :status " +
            "AND pa.dueDate < ':currentDate' " +
            "AND c.companyName LIKE %:partnerName%", nativeQuery = true)
    Page<PcptActivityInst> findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndPartnerNameAndDelayedProgress(@Param("sponsorKey") String sponsorKey,@Param("activityInstKey") String activityInstKey,
                                                                                             @Param("status") String status,@Param("partnerName") String partnerName,
                                                                                                               @Param("currentDate") String currentDate,Pageable pageable);

    @Query(value = "SELECT pa FROM PcptActivityInst pa " +
            "INNER JOIN Partners p ON pa.partnerKey = p.partnerKey " +
            "INNER JOIN Company c ON p.companyKey = c.companyKey " +
            "WHERE pa.sponsorKey = :sponsorKey " +
            "AND pa.activityInstKey = :activityInstKey " +
            "AND pa.pcptInstStatus = :status " +
            "AND pa.dueDate >= ':currentDate' " +
            "AND c.companyName LIKE %:partnerName%",nativeQuery = true)
    Page<PcptActivityInst> findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndPartnerNameAndOnScheduleProgress(@Param("sponsorKey") String sponsorKey,@Param("activityInstKey") String activityInstKey,
                                                                                             @Param("status") String status,@Param("partnerName") String partnerName,
                                                                                                                  @Param("currentDate") String currentDate,Pageable pageable);


    @Query(value = "SELECT pa FROM PcptActivityInst pa " +
            "WHERE pa.sponsorKey = :sponsorKey " +
            "AND pa.activityInstKey = :activityInstKey " +
            "AND pa.pcptInstStatus = :status " +
            "AND pa.currentTask = :currentTask " +
            "AND pa.dueDate < ':currentDate'", nativeQuery = true)
    Page<PcptActivityInst> findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndCurrentTaskAndDelayedProgress(@Param("sponsorKey") String sponsorKey, @Param("activityInstKey") String activityInstKey,
                                                                                                                             @Param("status") String status, @Param("currentTask") String currentTask,
                                                                                                               @Param("currentDate") String currentDate, Pageable pageable);

    @Query(value = "SELECT pa FROM PcptActivityInst pa " +
            "WHERE pa.sponsorKey = :sponsorKey " +
            "AND pa.activityInstKey = :activityInstKey " +
            "AND pa.pcptInstStatus = :status " +
            "AND pa.currentTask = :currentTask " +
            "AND pa.dueDate >= ':currentDate'", nativeQuery = true)
    Page<PcptActivityInst> findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndCurrentTaskAndOnScheduleProgress(@Param("sponsorKey") String sponsorKey, @Param("activityInstKey") String activityInstKey,
                                                                                                                                @Param("status") String status, @Param("currentTask") String currentTask,
                                                                                                                  @Param("currentDate") String currentDate, Pageable pageable);

    @Query(value = "SELECT pa FROM PcptActivityInst pa " +
            "INNER JOIN Partners p ON pa.partnerKey = p.partnerKey " +
            "INNER JOIN Company c ON p.companyKey = c.companyKey " +
            "WHERE pa.sponsorKey = :sponsorKey " +
            "AND pa.activityInstKey = :activityInstKey " +
            "AND pa.pcptInstStatus = :status " +
            "AND pa.currentTask = :currentTask " +
            "AND c.companyName LIKE %:partnerName%", nativeQuery = true)
    Page<PcptActivityInst> findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndCurrentTaskAndPartnerName(@Param("sponsorKey") String sponsorKey, @Param("activityInstKey") String activityInstKey,
                                                                                                                             @Param("status") String status, @Param("currentTask") String currentTask,
                                                                                                                             @Param("partnerName") String partnerName, Pageable pageable);

    @Query(value = "SELECT pa FROM PcptActivityInst pa " +
            "INNER JOIN Partners p ON pa.partnerKey = p.partnerKey " +
            "INNER JOIN Company c ON p.companyKey = c.companyKey " +
            "WHERE pa.sponsorKey = :sponsorKey " +
            "AND pa.activityInstKey = :activityInstKey " +
            "AND pa.pcptInstStatus = :status " +
            "AND pa.currentTask = :currentTask " +
            "AND c.companyName LIKE %:partnerName% " +
            "AND pa.dueDate < ':currentDate'", nativeQuery = true)
    Page<PcptActivityInst> findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndCurrentTaskAndPartnerNameAndDelayedProgress(@Param("sponsorKey") String sponsorKey, @Param("activityInstKey") String activityInstKey,
                                                                                                                             @Param("status") String status, @Param("currentTask") String currentTask,
                                                                                                                             @Param("partnerName") String partnerName, @Param("currentDate") String currentDate, Pageable pageable);

    @Query(value = "SELECT pa FROM PcptActivityInst pa " +
            "INNER JOIN Partners p ON pa.partnerKey = p.partnerKey " +
            "INNER JOIN Company c ON p.companyKey = c.companyKey " +
            "WHERE pa.sponsorKey = :sponsorKey " +
            "AND pa.activityInstKey = :activityInstKey " +
            "AND pa.pcptInstStatus = :status " +
            "AND pa.currentTask = :currentTask " +
            "AND c.companyName LIKE %:partnerName% " +
            "AND pa.dueDate >= ':currentDate'",nativeQuery = true)
    Page<PcptActivityInst> findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndCurrentTaskAndPartnerNameAndOnScheduleProgress(@Param("sponsorKey") String sponsorKey, @Param("activityInstKey") String activityInstKey,
                                                                                                                                @Param("status") String status, @Param("currentTask") String currentTask,
                                                                                                                                @Param("partnerName") String partnerName, @Param("currentDate") String currentDate, Pageable pageable);


    @Query(value = "SELECT pa FROM PcptActivityInst pa " +
            "INNER JOIN Partners p ON pa.partnerKey = p.partnerKey " +
            "INNER JOIN Company c ON p.companyKey = c.companyKey " +
            "WHERE pa.sponsorKey = :sponsorKey " +
            "AND pa.activityInstKey = :activityInstKey " +
            "AND c.companyName LIKE %:partnerName% " +
            "AND pa.dueDate < ':currentDate'", nativeQuery = true)
    Page<PcptActivityInst> findBySponsorKeyAndActivityInstKeyAndPartnerNameAndDelayedProgress(@Param("sponsorKey") String sponsorKey, @Param("activityInstKey") String activityInstKey,
                                                                                                                             @Param("partnerName") String partnerName, @Param("currentDate") String currentDate, Pageable pageable);

    @Query(value = "SELECT pa FROM PcptActivityInst pa " +
            "INNER JOIN Partners p ON pa.partnerKey = p.partnerKey " +
            "INNER JOIN Company c ON p.companyKey = c.companyKey " +
            "WHERE pa.sponsorKey = :sponsorKey " +
            "AND pa.activityInstKey = :activityInstKey " +
            "AND c.companyName LIKE %:partnerName% " +
            "AND pa.dueDate >= ':currentDate'", nativeQuery = true)
    Page<PcptActivityInst> findBySponsorKeyAndActivityInstKeyAndPartnerNameAndOnScheduleProgress(@Param("sponsorKey") String sponsorKey, @Param("activityInstKey") String activityInstKey,
                                                                                                                                @Param("partnerName") String partnerName, @Param("currentDate") String currentDate, Pageable pageable);
    PcptActivityInst findByPcptActivityInstKey(String pcptActivityInstKey);

    List<PcptActivityInst> findByActivityInstKey(String activityInstKey);
}


