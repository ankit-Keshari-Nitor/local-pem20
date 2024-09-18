package com.precisely.pem.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@Builder
@Table(name = "VCH_SPONSOR")
public class Sponsor extends BaseEntity {
    @Id
    @Column(name="SPONSOR_KEY")
    private String sponsorKey;

    @Column(name="ADMIN_PARTICIPANT_KEY")
    private String adminParticipantKey;

    @Column(name="COMPANY_KEY")
    private String companyKey;

    @Column(name="DOMAIN_URL")
    private String domainUrl;

    @Column(name="REGISTRATION_MODE")
    private String registrationMode;

    @Column(name="SPONSOR_STATUS")
    private String sponsorStatus;

    @Column(name="TITLE")
    private String title;

    @Column(name="SUPPORT_ENABLED")
    private String supportEnabled;

    @Column(name="SPONSOR_TYPE")
    private String sponsorType;

    @Column(name="MANAGED_BY")
    private String managedBy;

    @Column(name="SUBSTATUS")
    private String isSubstatus;
}
