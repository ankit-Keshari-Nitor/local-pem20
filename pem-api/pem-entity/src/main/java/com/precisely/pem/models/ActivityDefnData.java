package com.precisely.pem.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.sql.Blob;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@Table(name = "VCH_ACTIVITY_DEFN_DATA")
public class ActivityDefnData extends BaseEntity {
    @Id
    @Column(name="ACTIVITY_DEFN_DATA_KEY")
    private String activityDefnDataKey;

    @Column(name="DEF_DATA")
    private Blob defData;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "activity_Defn_Version")
    private ActivityDefnVersion activityDefnVersion;
}
