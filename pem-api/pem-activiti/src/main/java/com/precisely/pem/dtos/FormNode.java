package com.precisely.pem.dtos;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class FormNode extends Node {
    private String description;
    private String userKeys;
    private String roleKeys;
    private String form;


    public void setDescription(String description) {
        this.description = description;
    }

    public void setUserKeys(String userKeys) {
        this.userKeys = userKeys;
    }

    public void setRoleKeys(String roleKeys) {
        this.roleKeys = roleKeys;
    }

    public void setForm(String form) {
        this.form = form;
    }

}
