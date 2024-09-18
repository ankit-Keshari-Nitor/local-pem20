package com.precisely.pem.enums;

import lombok.Getter;

@Getter
public enum Application {
    PEM ("PEM"), PP ("PP");

    private String app;

    Application(String app) {
        this.app = app;
    }

}
