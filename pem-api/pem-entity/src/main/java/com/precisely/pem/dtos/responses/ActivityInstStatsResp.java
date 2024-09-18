package com.precisely.pem.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ActivityInstStatsResp {
    public int participants;
    public int completed;
    public int sponsorAction;
    public int delayed;
    public int onSchedule;
}
