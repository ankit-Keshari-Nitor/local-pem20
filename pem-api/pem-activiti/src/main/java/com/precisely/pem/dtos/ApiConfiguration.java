package com.precisely.pem.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiConfiguration {
    private String apiConfiguration;
    private String url;
    private String method;
    private String requestContentType;
    private String responseContentType;
    private String file;
    private String requestHeaders;
    private String request;
    private String sampleResponse;
    private String response;
}
