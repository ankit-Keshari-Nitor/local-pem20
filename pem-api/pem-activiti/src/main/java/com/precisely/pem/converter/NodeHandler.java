package com.precisely.pem.converter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.precisely.pem.dtos.BpmnConverterRequest;
import com.precisely.pem.dtos.Node;

public interface NodeHandler {
    void handleNode(Node node, ObjectNode outputJson, ObjectMapper objectMapper, BpmnConverterRequest request);
    void setNextHandler(NodeHandler nextHandler);
}
