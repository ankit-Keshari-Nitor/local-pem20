package com.precisely.pem.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
@Table(name = "VCH_USER_ROLE")
public class UserRole {

    @Id
    @Column(name = "USER_ROLE_KEY")
    private String userRoleKey;

    @Column(name = "CREATE_TS")
    private LocalDateTime createTs;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "MODIFIED_BY")
    private String modifiedBy;

    @Column(name = "MODIFY_TS")
    private LocalDateTime modifyTs;

    @Column(name = "PARTICIPANT_KEY")
    private String participantKey;

    @Column(name = "RESOURCE_ROLE_KEY")
    private String resourceRoleKey;

    @Column(name = "ROLE_KEY")
    private String roleKey;

    @Column(name = "SPONSOR_KEY")
    private String sponsorKey;

    @Column(name = "DIVISION_KEY")
    private String divisionKey;
}

