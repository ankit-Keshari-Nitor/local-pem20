package com.precisely.pem.enums;

import lombok.Getter;

@Getter
public enum SortDirection {
    ASC ("ASC"), DESC ("DESC");

    private String sort_direction;
    SortDirection(String asc) {
        this.sort_direction = sort_direction;
    }
}
