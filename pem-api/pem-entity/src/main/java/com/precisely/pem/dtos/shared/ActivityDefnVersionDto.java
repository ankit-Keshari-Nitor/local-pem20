package com.precisely.pem.dtos.shared;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActivityDefnVersionDto {
    public String activityDefnVersionKey;
    public String activityDefnKey;
    public String activityDefnDataKey;
    public Double version;
    public String status;
    public Boolean isDefault;
    public Boolean isEncrypted;
    public String encryptionKey;
    public LocalDateTime createTs;
    public String createdBy;
    public LocalDateTime modifyTs;
    public String modifiedBy;
    public Double schemaVersion;
    public String activityVersionDescription;
}
