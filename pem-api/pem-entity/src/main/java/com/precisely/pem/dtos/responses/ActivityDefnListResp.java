package com.precisely.pem.dtos.responses;

import lombok.Data;

@Data
public class ActivityDefnListResp {
    public String activityDefnKey;
    public String name;
    public String description;
    public String application;
    public String activityVersionLink;
    public Boolean isDeleted;
    public ActivityVersionResp defaultVersion;
}
