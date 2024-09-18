package com.precisely.pem.dtos.shared;

import com.precisely.pem.models.BaseEntity;
import lombok.*;

import java.sql.Blob;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PcptActivityInstDto extends BaseEntity {
    private String pcptActivityInstKey;
    private String activityInstKey;
    private String activityWorkflowInstKey;
    private String partnerKey;
    private String completionDate;
    private String currentTask;
    private String dueDate;
    private String pcptInstStatus;
    private String sponsorKey;
    private Boolean isDeleted;
    private Boolean taskCompleted;
    private Boolean isEncrypted;
    private String mailGroupKey;
    private Boolean isAlreadyRolledOut;
    private Blob pcptContextData;
}
