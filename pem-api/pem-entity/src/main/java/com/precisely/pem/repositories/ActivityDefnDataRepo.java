package com.precisely.pem.repositories;

import com.precisely.pem.models.ActivityDefnData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityDefnDataRepo extends JpaRepository<ActivityDefnData,String> {

    ActivityDefnData findByActivityDefnDataKey(String activityDefnDataKey);

}
