package com.precisely.pem.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "VCH_COMPANY")
public class Company {
    @Id
    @Column(name="COMPANY_KEY")
    private String companyKey;

    @Column(name = "COMPANY_NAME")
    private String companyName;

}
