package com.precisely.pem.enums;

import lombok.Getter;

@Getter
public enum Status {
    DRAFT ("DRAFT"), FINAL ("FINAL"), DELETE ("DELETE");
    private String status;
    Status(String status) {
        this.status = status;
    }
}
