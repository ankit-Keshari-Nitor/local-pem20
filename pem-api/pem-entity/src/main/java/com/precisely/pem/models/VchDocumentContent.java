package com.precisely.pem.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.sql.Blob;
import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "VCH_DOCUMENT_CONTENT")
public class VchDocumentContent extends BaseEntity{

    @Id
    @Column(name="DOCUMENT_CONTENT_KEY")
    private String documentContentKey;

    @Column(name="DOCUMENT_KEY")
    private String documentKey;

    @Column(name="CONTENT")
    private Blob content;

    @Column(name="CREATE_TS")
    private LocalDateTime createTs;

    @Column(name="CREATED_BY")
    private String createdBy;

    @Column(name="MODIFIED_BY")
    private String modifiedBy;

    @Column(name="MODIFY_TS")
    private LocalDateTime modifyTs;
}
