package com.precisely.pem.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "VCH_PARTNER")
public class Partners extends BaseEntity{

    @Id
    @Column(name="PARTNER_KEY")
    private String partnerKey;

    @Column(name="ADMIN_PARTICIPANT_KEY")
    private String adminParticipantKey;

    @Column(name="COMPANY_KEY")
    private String companyKey;

    @Column(name="PARTNER_STATUS")
    private String partnerStatus;

    @Column(name="REGISTRATION_MODE")
    private String registrationMode;

    @Column(name="SPONSOR_KEY")
    private String sponsorKey;

    @Column(name="PARTNER_UNIQUE_ID")
    private String partnerUniqueId;

    @Column(name="SUBSTATUS")
    private String substatus;

    @Column(name="PARTNER_TYPE")
    private String partnerType;

}
