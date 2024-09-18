package com.precisely.pem.enums;

import lombok.Getter;

@Getter
public enum PcptInstProgress {
    DELAYED("Delayed"), ONSCHEDULE("OnSchedule");
    private String pcptInstProgress;

    PcptInstProgress(String pcptInstProgress) {
        this.pcptInstProgress = pcptInstProgress;
    }
}
