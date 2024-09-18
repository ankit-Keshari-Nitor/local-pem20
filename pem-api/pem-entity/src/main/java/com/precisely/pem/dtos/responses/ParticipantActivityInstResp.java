package com.precisely.pem.dtos.responses;

import lombok.Data;

@Data
public class ParticipantActivityInstResp {
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
}
