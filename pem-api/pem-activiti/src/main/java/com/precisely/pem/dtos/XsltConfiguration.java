package com.precisely.pem.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class XsltConfiguration {
    private String xslt;
    private String input;
    private String sampleOutput;
    private String output;
    private String escapeInput;
}
