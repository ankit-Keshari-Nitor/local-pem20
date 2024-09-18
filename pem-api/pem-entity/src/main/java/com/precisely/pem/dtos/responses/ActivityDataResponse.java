package com.precisely.pem.dtos.responses;

import lombok.Builder;
import lombok.Data;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;

@Data
@Builder
public class ActivityDataResponse {
    private InputStreamResource streamResource;
    private String fileName;
}
