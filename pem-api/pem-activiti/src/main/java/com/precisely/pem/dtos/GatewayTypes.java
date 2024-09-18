package com.precisely.pem.dtos;

import lombok.extern.log4j.Log4j2;

import java.util.Arrays;
import java.util.Optional;

public enum GatewayTypes{

    BRANCH_START("branchStart",NodeTypes.EXCLUSIVE_GATEWAY),
    BRANCH_END("branchEnd",NodeTypes.INCLUSIVE_GATEWAY),
    LOOP_START("loopStart",NodeTypes.EXCLUSIVE_GATEWAY),
    LOOP_END("loopEnd",NodeTypes.EXCLUSIVE_GATEWAY);

    private String name;
    private NodeTypes nodeType;
    GatewayTypes(String name,NodeTypes nodeType) {
        this.name = name;
        this.nodeType = nodeType;
    }

    public static NodeTypes getGatewayType(String name){
        Optional<NodeTypes> gatewayNode = Arrays.stream(GatewayTypes.values()).filter(value -> value.name.equalsIgnoreCase(name)).map(value -> value.nodeType).findFirst();
        return gatewayNode.orElse(null);
    }

}
