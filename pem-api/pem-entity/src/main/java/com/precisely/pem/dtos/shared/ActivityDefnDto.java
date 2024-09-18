package com.precisely.pem.dtos.shared;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActivityDefnDto {
    public String activityDefnKey;
    public String sponsorKey;
    public String activityName;
    public String activityDescription;
    public LocalDateTime createTs;
    public String createdBy;
    public LocalDateTime modifyTs;
    public String modifiedBy;
    public String application;
    public Boolean isDeleted;
    public Boolean migrationStatus;
    public String activityVersionLink;
}
