package com.precisely.pem.dtos.responses;

import lombok.Data;

import java.util.List;

@Data
public class TasksListResp {
    public String taskKey;
    public String taskType;
    public String pcptActivityInstKey;
    public String name;
    public String status;
    public String startDate;
    public String endDate;
    public String errorMessage;
    public String ownerName;
    public String ownerEmail;
    public String sponsorKey;
    public boolean isExecutable;
    public List<String> nextExecutableNodes;

    public boolean getIsExecutable() {
        return isExecutable;
    }
}
