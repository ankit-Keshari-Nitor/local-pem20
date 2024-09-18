package com.precisely.pem.dtos.shared;

import lombok.Data;

@Data
public class ActivityStatsDto {
    int partners;
    int notStarted;
    int started;
    int completed;
    int sponsorAction;
}
