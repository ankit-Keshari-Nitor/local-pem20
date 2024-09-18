package com.precisely.pem.enums;

import lombok.Getter;

@Getter
public enum RoleSortBy {
    modifyTs ("modifyTs"), roleName ("roleName");

    private String name;

    RoleSortBy(String name) {
        this.name = name;
    }

}
