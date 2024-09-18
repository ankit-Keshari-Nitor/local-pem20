package com.precisely.pem.dtos.responses;

import lombok.Data;

@Data
public class ActivityDefnVersionListResp {
    public String activityDefnVersionKey;
    public Boolean isEncrypted;
    public Boolean isDefault;
    public long version;
    public String status;
    public String description;
}
