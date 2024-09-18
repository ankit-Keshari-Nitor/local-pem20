package com.precisely.pem.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityDefnVersionResp {
    public String location;
    public String activityDefnKey;
    public String activityDefnVersionKey;
}
