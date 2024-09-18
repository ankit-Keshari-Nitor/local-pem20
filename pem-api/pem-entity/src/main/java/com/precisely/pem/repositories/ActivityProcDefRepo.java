package com.precisely.pem.repositories;

import com.precisely.pem.models.ActivityProcDef;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityProcDefRepo extends JpaRepository<ActivityProcDef,String> {
    List<ActivityProcDef> findByResourceName(String resourceName);
}
