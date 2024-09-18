package com.precisely.pem.enums;

import lombok.Getter;

@Getter
public enum UserSortBy {
    modifyTs ("modifyTs"), userName ("userName");

    private String name;

    UserSortBy(String name) {
        this.name = name;
    }

}
