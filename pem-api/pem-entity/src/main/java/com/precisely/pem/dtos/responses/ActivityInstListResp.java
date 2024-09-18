package com.precisely.pem.dtos.responses;

import com.precisely.pem.dtos.shared.ActivityStatsDto;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ActivityInstListResp {
    private String activityInstKey;
    private String activityDefnVersionKey;
    private String name;
    private String description;
    //    private String activityTasks;
    private String alertFrequency;
    private LocalDateTime alertDate;
    private LocalDateTime dueDate;
    private String isCreatedByPartner;
    private LocalDateTime startDate;
    private String status;
    private String sponsorKey;
    //    private String pcptActivityInstances;
    private ActivityStatsDto activityStats;
    private String emailStatus;
}
