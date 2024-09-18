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
@Table(name = "VCH_COMPANY_USER")
public class CompanyUser {

    @Id
    @Column(name = "COMPANY_USER_KEY")
    private String companyUserKey;

    @Column(name = "COMPANY_KEY")
    private String companyKey;

    @Column(name = "CONTACT_KEY")
    private String contactKey;

    @Column(name = "CREATE_TS")
    private LocalDateTime createTs;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "FAILED_LOGIN_COUNT")
    private Integer failedLoginCount;

    @Column(name = "FIRST_NAME")
    private String firstName;

    @Column(name = "ITERATION_COUNT")
    private Integer iterationCount;

    @Column(name = "LAST_NAME")
    private String lastName;

    @Column(name = "LOCK_RELEASE_DATE")
    private LocalDateTime lockReleaseDate;

    @Column(name = "MODIFIED_BY")
    private String modifiedBy;

    @Column(name = "MODIFY_TS")
    private LocalDateTime modifyTs;

    @Column(name = "PASSPHRASE")
    private String passphrase;

    @Column(name = "PASSWORD_EXPIRY_DATE")
    private LocalDateTime passwordExpiryDate;

    @Column(name = "SALT")
    private String salt;

    @Column(name = "USER_NAME")
    private String userName;
}

