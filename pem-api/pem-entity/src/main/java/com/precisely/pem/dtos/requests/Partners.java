package com.precisely.pem.dtos.requests;

import lombok.Data;

import java.util.List;

@Data
public class Partners {
    private String partnerKey;
    private List<ContextDataNodes> contextDataNodes;
}

