package com.precisely.pem.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "API_CONFIGURATION")
public class ApiConfig extends BaseEntity{

    @Id
    @Column(name="API_CONFIGURATION_KEY")
    private String apiConfigKey;

    @Column(name="HOST")
    private String host;

    @Column(name="NAME")
    private String apiName;

    @Column(name="SPONSOR_KEY")
    private String sponsorKey;

    @Column(name="PORT")
    private String port;

    @Column(name="PROTOCOL")
    private String protocol;

    @Column(name="USER_NAME")
    private String userName;

    @Column(name="VAULT_KEY")
    private String vaultKey;

    @Column(name="CREATE_TS")
    private LocalDateTime createTs;

    @Column(name="CREATED_BY")
    private String createdBy;

    @Column(name="MODIFIED_BY")
    private String modifiedBy;

    @Column(name="MODIFY_TS")
    private LocalDateTime modifyTs;

    @Column(name="CLIENT_CERT")
    private String clientCert;

    @Column(name="PREEMPTIVE_AUTH")
    private String preemptiveAuth;

    @Column(name="API_KEY_KEY")
    private String apiKey;

    @Column(name="VERIFY_HOST")
    private String verifyHost;

    @Column(name="IS_INTERNAL_AUTH")
    private String isInternalAuth;

    @Column(name="SSL_PROTOCOL")
    private String sslProtocol;

}
