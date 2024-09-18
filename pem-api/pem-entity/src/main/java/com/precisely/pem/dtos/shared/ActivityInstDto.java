package com.precisely.pem.dtos.shared;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Blob;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ActivityInstDto {
    private String activityInstKey;
    private String activityDefnKey;
    private String activityDefnVersionKey;
    private String name;
    private String description;
    private String status;
    private String startDate;
    private String dueDate;
    private String endDate;
    private String alertDate;
    private int alertFrequency;
    private Blob defData;
    private Boolean isEncrypted;
    private Boolean isDeleted;
    private Boolean isCreatedByPartner;
    private String application;
    private String sponsorKey;
    private String emailPref;
}
