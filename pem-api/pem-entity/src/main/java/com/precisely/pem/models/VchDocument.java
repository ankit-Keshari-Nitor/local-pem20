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
@Table(name = "VCH_DOCUMENT")
public class VchDocument extends BaseEntity{

    @Id
    @Column(name = "DOCUMENT_KEY")
    private String documentKey;

    @Column(name = "CHARACTER_ENCODING")
    private String characterEncoding;

    @Column(name = "CONTENT_LENGTH")
    private Long contentLength;

    @Column(name = "CONTENT_TYPE")
    private String contentType;

    @Column(name = "DOCUMENT_CATEGORY")
    private String documentCategory;

    @Column(name = "CREATE_TS")
    private LocalDateTime createTs;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "DOCUMENT_NAME")
    private String documentName;

    @Column(name = "DOCUMENT_CONTENT_KEY")
    private String documentContentKey;

    @Column(name = "USER_DOCUMENT_NAME")
    private String userDocumentName;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "MODIFIED_BY")
    private String modifiedBy;

    @Column(name = "MODIFY_TS")
    private LocalDateTime modifyTs;

    @Column(name = "SPONSOR_KEY")
    private String sponsorKey;

    @Column(name = "PARTNER_KEY")
    private String partnerKey;

    @Column(name = "OWNER")
    private String owner;

    @Column(name = "IS_ENCRYPTED")
    private Boolean isEncrypted;

    @Column(name = "VAULT_KEY")
    private String vaultKey;

    @Column(name = "SCAN_STATUS")
    private String scanStatus;
}
