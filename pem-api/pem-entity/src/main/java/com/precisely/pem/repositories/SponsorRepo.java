package com.precisely.pem.repositories;

import com.precisely.pem.dtos.responses.SponsorInfo;
import com.precisely.pem.models.Sponsor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SponsorRepo extends JpaRepository<Sponsor,String> {
    @Query(nativeQuery = true, value = "SELECT sponsor_key FROM SPONSOR WHERE domain_url = LOWER(:sponsorContext)")
    String getSponsorKey(@Param("sponsorContext") String sponsorContext);

    @Query(value = "SELECT new com.precisely.pem.dtos.responses.SponsorInfo(company.companyName,sponsor.sponsorKey) FROM Sponsor sponsor INNER JOIN Company company ON sponsor.companyKey = company.companyKey " +
            "WHERE sponsor.domainUrl = LOWER(:sponsorContext) AND sponsor.sponsorStatus='APPROVED'")
    SponsorInfo getActiveSponsorInfoBySponsorContext(@Param("sponsorContext") String sponsorContext);
}
