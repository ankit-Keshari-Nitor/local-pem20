package com.precisely.pem.enums;

import lombok.Getter;

@Getter
public enum VersionSortBy {
    modifyTs("modifyTs"), isEncrypted("isEncrypted"), status("status");

    private String sort_by;

    VersionSortBy(String asc) {
        this.sort_by = sort_by;
    }

}
