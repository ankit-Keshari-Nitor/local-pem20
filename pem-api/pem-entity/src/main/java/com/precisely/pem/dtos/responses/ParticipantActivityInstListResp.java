package com.precisely.pem.dtos.responses;

import com.precisely.pem.dtos.shared.ActivityInstStatsDto;
import lombok.Data;

@Data
public class ParticipantActivityInstListResp {
    public String pcptActivityInstKey;
    public String activityInstKey;
    public String pcptInstStatus;
    public String application;
    public String completionDate;
    public String currentTask;
    public String isAlreadyRolledOut;
    public String tasks;
    public String sponsorKey;
    public String startDate;
    public PartnerInfo partner;
    public String dueDate;
    public String contextData;
    public ActivityInstStatsDto activityStats;
}
