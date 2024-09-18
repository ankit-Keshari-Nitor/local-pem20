package com.precisely.pem.dtos.responses;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class BaseResourceResp {
    private String status;
    private String modifyTs;

    public BaseResourceResp() {
    }

    public BaseResourceResp(String status, String modifyTs) {
        this.status = status;
        this.modifyTs = modifyTs;
    }
}
