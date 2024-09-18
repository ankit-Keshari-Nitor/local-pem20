package com.precisely.pem.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Node {
    //common
    private String id;
    private String parentId;
    private String type;
    private String name;
    private Diagram diagram;
    //form
    private String description;
    private String userKeys;
    private String roleKeys;
    private String form;
    private String formNodeType;
    //xslt
    private XsltConfiguration xslt;
    //api node
    private ApiConfiguration api;
    //gateway
    private String gatewayType;
    //Sub Process
    private List<Node> nodes;
    private Integer estimateDays;
    private Boolean showToPartner;
    //Call Activiti
    private String targetActivity;
    private List<Variable> inVariables;
    private List<Variable> outVariables;

    //Looping
    Looping loop;

    List<Connector> connectors;
}
