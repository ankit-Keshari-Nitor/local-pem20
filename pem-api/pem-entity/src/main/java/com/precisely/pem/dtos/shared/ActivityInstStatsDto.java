package com.precisely.pem.dtos.shared;

import lombok.Data;

@Data
public class ActivityInstStatsDto {
    private int tasksCompleted;
    private int tasksSkipped;
    private int estimatedDelay;
    private String estimatedCompletionDate;
}
