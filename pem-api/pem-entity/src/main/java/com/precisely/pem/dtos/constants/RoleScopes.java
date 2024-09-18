package com.precisely.pem.dtos.constants;

public enum RoleScopes {

    PARTNER("PARTNER"),
    SPONSOR("SPONSOR"),
    DIVISION("DIVISION"),
    SYSTEM("SYSTEM");

    private String name;
    RoleScopes(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
