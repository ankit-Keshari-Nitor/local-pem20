package com.precisely.pem.models;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "VCH_ROLE")
public class Role {
    @Id
    @Column(name="ROLE_KEY")
    private String roleKey;

    @Column(name="CATEGORY")
    private String category;

    @Column(name="CREATE_TS")
    private LocalDateTime createTs;

    @Column(name="CREATED_BY")
    private String createdBy;

    @Column(name="MODIFIED_BY")
    private String modifiedBy;

    @Column(name="MODIFY_TS")
    private LocalDateTime modifyTs;

    @Column(name="ROLE_NAME")
    private String roleName;

    @Column(name="ROLE_SCOPE")
    private String roleScope;

    @Column(name="ROLE_TYPE")
    private String roleType;

    @Column(name="SPONSOR_KEY")
    private String sponsorKey;
}

