package com.precisely.pem.enums;

import lombok.Getter;

@Getter
public enum InstStatus {
    STARTED ("STARTED"), CLOSED ("CLOSED");

    private String instStatus;

    InstStatus(String instStatus) {
        this.instStatus = instStatus;
    }
}
