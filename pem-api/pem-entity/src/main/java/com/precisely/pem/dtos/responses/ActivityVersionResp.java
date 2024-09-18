package com.precisely.pem.dtos.responses;

import lombok.Data;

@Data
public class ActivityVersionResp {
    public String activityDefnVersionKey;
    public Boolean isEncrypted;
    public long version;
    public String status;
}
