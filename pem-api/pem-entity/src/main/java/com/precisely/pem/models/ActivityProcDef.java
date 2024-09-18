package com.precisely.pem.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "ACT_RE_PROCDEF")
public class ActivityProcDef {
    @Id
    @Column(name="ID_")
    private String id;

    @Column(name="REV_")
    private Integer rev;

    @Column(name="CATEGORY_")
    private String category;

    @Column(name="NAME_")
    private String name;

    @Column(name="KEY_")
    private String key;

    @Column(name="VERSION_")
    private Integer version;

    @Column(name="DEPLOYMENT_ID_")
    private String deploymentId;

    @Column(name="RESOURCE_NAME_")
    private String resourceName;

    @Column(name="DGRM_RESOURCE_NAME_")
    private String dgrmResourceName;

    @Column(name="DESCRIPTION_")
    private String description;

    @Column(name="HAS_START_FORM_KEY_")
    private String hasStartFormKey;

    @Column(name="HAS_GRAPHICAL_NOTATION_")
    private String hasGraphicalNotation;

    @Column(name="SUSPENSION_STATE_")
    private String suspensionState;

    @Column(name="TENANT_ID_")
    private String tenantId;

    @Column(name="ENGINE_VERSION_")
    private String engineVersion;

    @Column(name="APP_VERSION_")
    private String appVersion;
}
