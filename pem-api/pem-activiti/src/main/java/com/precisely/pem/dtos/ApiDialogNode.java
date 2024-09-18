package com.precisely.pem.dtos;

public class ApiDialogNode extends Node{
    private ApiConfiguration apiConfiguration;
    private String description;

    public ApiConfiguration getApi() {
        return apiConfiguration;
    }

    public void setApi(ApiConfiguration apiConfiguration) {
        this.apiConfiguration = apiConfiguration;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}



