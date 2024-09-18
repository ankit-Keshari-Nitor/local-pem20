package com.precisely.pem.models;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Blob;
import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "VCH_PCPT_ACTIVITY_INST")
public class PcptActivityInst extends BaseEntity{
    @Id
    @Column(name="PCPT_ACTIVITY_INST_KEY")
    private String pcptActivityInstKey;

    @Column(name="ACTIVITY_INST_KEY")
    private String activityInstKey;

    @Column(name="ACTIVITY_WORKFLOW_INST_KEY")
    private String activityWorkflowInstKey;

    @Column(name="PARTNER_KEY")
    private String partnerKey;

    @Column(name="COMPLETION_DATE")
    private LocalDateTime completionDate;

    @Column(name="CURRENT_TASK")
    private String currentTask;

    @Column(name="DUE_DATE")
    private LocalDateTime dueDate;

    @Column(name="PCPT_INST_STATUS")
    private String pcptInstStatus;

    @Column(name="SPONSOR_KEY")
    private String sponsorKey;

    @Column(name="IS_DELETED")
    private Boolean isDeleted;

    @Column(name="TASK_COMPLETED")
    private Boolean taskCompleted;

    @Column(name="IS_ENCRYPTED")
    private Boolean isEncrypted;

    @Column(name="MAIL_GROUP_KEY")
    private String mailGroupKey;

    @Column(name="IS_ALREADY_ROLLED_OUT")
    private Boolean isAlreadyRolledOut;

    @Column(name="PCPT_CONTEXT_DATA")
    private Blob pcptContextData;

    @ManyToOne
    @JoinColumn(name = "activity_Inst_Details")
    private ActivityInst activityInst;
}
