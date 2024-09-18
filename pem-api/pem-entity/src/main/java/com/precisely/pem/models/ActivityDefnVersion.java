package com.precisely.pem.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@Table(name = "VCH_ACTIVITY_DEFN_VERSION")
public class ActivityDefnVersion extends BaseEntity {
    @Id
    @Column(name="ACTIVITY_DEFN_VERSION_KEY")
    private String activityDefnVersionKey;

    @Column(name="ACTIVITY_DEFN_KEY")
    private String activityDefnKey;

    @Column(name="DESCRIPTION")
    private String description;

    @Column(name="ACTIVITY_DEFN_DATA_KEY")
    private String activityDefnDataKey;

    @Column(name="VERSION", columnDefinition="Decimal(10,1)")
    private Double version;

    @Column(name="STATUS")
    private String status;

    @Column(name="IS_DEFAULT")
    private Boolean isDefault;

    @Column(name="IS_ENCRYPTED")
    private Boolean isEncrypted;

    @Column(name="VAULT_KEY")
    private String vaultKey;

    @Column(name="SCHEMA_VERSION", columnDefinition="Decimal(10,2)")
    private Double schemaVersion;

    @ManyToOne
    @JoinColumn(name = "activity_Defn_Details")
    private ActivityDefn activityDefn;

    @OneToOne
    @JoinColumn(name = "activity_Defn_Data")
    private ActivityDefnData activityDefnData;
}
