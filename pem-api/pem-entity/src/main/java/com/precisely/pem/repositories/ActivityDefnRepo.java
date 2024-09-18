package com.precisely.pem.repositories;

import com.precisely.pem.models.ActivityDefn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityDefnRepo extends JpaRepository<ActivityDefn,String> {
    ActivityDefn findByActivityDefnKeyAndSponsorKey(String activityDefnKey, String sponsorKey);

    ActivityDefn findByActivityName(String name);

    ActivityDefn findByActivityDefnKey(String activityDefnKey);
}
