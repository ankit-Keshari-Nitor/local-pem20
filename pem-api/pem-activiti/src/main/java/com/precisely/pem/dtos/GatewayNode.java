package com.precisely.pem.dtos;

import lombok.Builder;


public class GatewayNode extends Node{
    private String gatewayType;
    private String description;

    public String getGatewayType() {
        return gatewayType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setGatewayType(String gatewayType) {
        this.gatewayType = gatewayType;
    }
}
