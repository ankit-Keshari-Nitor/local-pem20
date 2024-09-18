package com.precisely.pem.dtos;

public enum CustomElementTextType {
    TYPE("type"),
    ESTIMATE_DAYS("estimateDays"),
    SHOW_TO_PARTNER("showToPartner");

    private String name;
    CustomElementTextType(String name){
        this.name = name;
    };

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
