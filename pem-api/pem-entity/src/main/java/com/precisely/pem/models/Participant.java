package com.precisely.pem.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "VCH_PARTICIPANT")
public class Participant {

    @Id
    @Column(name = "PARTICIPANT_KEY")
    private String participantKey;

    @Column(name = "BUSINESS_ROLE")
    private String businessRole;

    @Column(name = "COMMENTS")
    private String comments;

    @Column(name = "COMPANY_USER_KEY")
    private String companyUserKey;

    @Column(name = "CREATE_TS")
    private LocalDateTime createTs;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "IS_SPONSOR_USER")
    private String isSponsorUser;

    @Column(name = "MODIFIED_BY")
    private String modifiedBy;

    @Column(name = "MODIFY_TS")
    private LocalDateTime modifyTs;

    @Column(name = "PARTICIPANT_ROLE")
    private String participantRole;

    @Column(name = "PARTICIPANT_STATUS")
    private String participantStatus;

    @Column(name = "PARTNER_KEY")
    private String partnerKey;

    @Column(name = "REASON_FOR_REQUEST")
    private String reasonForRequest;

    @Column(name = "REGISTRATION_MODE")
    private String registrationMode;

    @Column(name = "SPONSOR_KEY")
    private String sponsorKey;

    @Column(name = "EXTERNAL_ID")
    private String externalId;

    @Column(name = "SOURCE_TYPE")
    private String sourceType;

    @Column(name = "EXTN_LAST_UPDATED")
    private LocalDateTime extnLastUpdated;

    @Column(name = "DATA_COLLECTION_PREF")
    private String dataCollectionPref;

    @Column(name = "TEMP_PARTICIPANT_ROLE")
    private String tempParticipantRole;
}