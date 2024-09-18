package com.precisely.pem.dtos;

public enum NodeTypes {
    START("START","StartNoneEvent"),
    END("END","EndNoneEvent"),
    FORM("FORM","UserTask"),
    SEQUENCE("CONNECTORS","SequenceFlow"),
    API_NODE("API","ServiceTask"),
    XSLT_NODE("XSLT","ServiceTask"),
    EXCLUSIVE_GATEWAY("GATEWAY","ExclusiveGateway"),
    INCLUSIVE_GATEWAY("GATEWAY","InclusiveGateway"),
    PARTNER_SUB_PROCESS("PARTNER","SubProcess"),
    SYSTEM_SUB_PROCESS("SYSTEM","SubProcess"),
    SPONSOR_SUB_PROCESS("SPONSOR","SubProcess"),
    CALL_ACTIVITY("CALL_ACTIVITY","CallActivity");

    private String name;
    private String bpmnName;
    NodeTypes(String name,String bpmnName) {
        this.name = name;
        this.bpmnName = bpmnName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBpmnName() {
        return bpmnName;
    }

    public void setBpmnName(String bpmnName) {
        this.bpmnName = bpmnName;
    }
}
