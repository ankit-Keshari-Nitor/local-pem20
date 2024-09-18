package com.precisely.pem.enums;

import lombok.Getter;

@Getter
public enum PcptInstStatus {
    NOT_STARTED("NotStarted"), STARTED("Started"), COMPLETED("Completed"),
    APPROVAL_PENDING("ApprovalPending"), CLOSED("Closed"), ERROR("Error");

    private String pcptInstStatus;

    PcptInstStatus(String pcptInstStatus) {
        this.pcptInstStatus = pcptInstStatus;
    }
}
