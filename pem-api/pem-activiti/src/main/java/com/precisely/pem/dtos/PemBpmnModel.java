package com.precisely.pem.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PemBpmnModel {
    private String name;
    private String description;
    private double schemaVersion;
    private PemProcess process;
}


