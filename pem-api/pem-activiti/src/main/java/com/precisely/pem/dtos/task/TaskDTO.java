package com.precisely.pem.dtos.task;

import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Data
public class TaskDTO {
    public String id;
    public String name;
    public String description;
    public String status;
    public Date completedDate;
    public String completedBy;
    public String form;//schema
    public String formData;//draft data
    public String processInstanceId;
    public String taskDefinitionKey;
    public String pcptActivityInstKey;
    public String activityInstKey;
    public String sponsorKey;
    public String formNodeType;
}
