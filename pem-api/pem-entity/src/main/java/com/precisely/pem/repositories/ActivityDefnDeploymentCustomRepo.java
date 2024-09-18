package com.precisely.pem.repositories;
import com.precisely.pem.models.ActivityDefn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ActivityDefnDeploymentCustomRepo extends JpaRepository<ActivityDefn,String> {
    @Query("SELECT a.activityDefnKey, a.activityName, a.application, " +
            "v.activityDefnVersionKey, v.activityDefnDataKey, v.status, v.version, ad.defData " +
            "FROM ActivityDefn a " +
            "JOIN ActivityDefnVersion v ON a.activityDefnKey = v.activityDefnKey " +
            "JOIN ActivityDefnData ad ON ad.activityDefnDataKey = v.activityDefnDataKey " +
            "WHERE v.activityDefnVersionKey = :activityDefnVersionKey")
    List<Object[]> findActivitiesByActivityDefnVersionKey(@Param("activityDefnVersionKey") String activityDefnVersionKey);
}