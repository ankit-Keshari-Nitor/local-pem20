package com.precisely.pem.repositories;

import com.precisely.pem.enums.Status;
import com.precisely.pem.models.ActivityDefnVersion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ActivityDefinitionVersionCustomRepo {
    Integer updateActivityDefinitionVersion(Status newStatus, Status oldStatus, String activityDefnKey);
    Integer deleteByActivityDefnKeyAndStatus(String activityDefnKey, String status);
    Page<ActivityDefnVersion> getAllVersionsList(String activityDefnKey, List<String> status, String sponsorKey, Boolean isDefault, String description, Pageable pageable);
}
