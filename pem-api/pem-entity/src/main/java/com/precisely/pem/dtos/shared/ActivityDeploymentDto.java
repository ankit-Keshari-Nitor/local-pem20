package com.precisely.pem.dtos.shared;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.sql.Blob;

@Data
@AllArgsConstructor
public class ActivityDeploymentDto {
    private String activityDefnKey;
    private String activityName;
    private String application;
    private String activityDefnVersionKey;
    private String activityDefnDataKey;
    private String status;
    private Double version;
    private Blob defData;
}
