package com.precisely.pem.converter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.precisely.pem.dtos.BpmnConverterRequest;
import com.precisely.pem.dtos.Connector;
import com.precisely.pem.dtos.Diagram;
import com.precisely.pem.dtos.Node;

import java.util.List;
import java.util.Objects;

import static com.precisely.pem.dtos.Constants.*;

public class SequenceFlowHandler {

    public void handleSequenceFlow(Connector connectorNode, ObjectNode outputJson, ObjectMapper objectMapper, BpmnConverterRequest request) {
        ObjectNode connectorJson = objectMapper.createObjectNode();

        // Set bounds
        ObjectNode bounds = connectorJson.putObject("bounds");
        bounds.putObject("lowerRight").put("x", 200 + WIDTH).put("y", 200+HEIGHT);
        bounds.putObject("upperLeft").put("x", 200 ).put("y", 200);

        // Add childShapes
        connectorJson.putArray("childShapes");

        // Add dockers
        ArrayNode dockersArray = connectorJson.putArray("dockers");
        dockersArray.add(objectMapper.createObjectNode().put("x", CONNECTOR_X).put("y", CONNECTOR_Y));
        dockersArray.add(objectMapper.createObjectNode().put("x", CONNECTOR_X).put("y", CONNECTOR_Y));

        // Add outgoing
        connectorJson.putArray("outgoing").addObject().put("resourceId", connectorNode.getSource().trim());

        // Add properties
        ObjectNode properties = connectorJson.putObject("properties");
        properties.put("bordercolor", "#000000");
        properties.put("conditionalflow", "None");
        properties.put("conditionsequenceflow", Objects.nonNull(connectorNode.getCondition()) ? connectorNode.getCondition() : "");
        properties.put("conditiontype", "None");
        properties.put("defaultflow", "None");
        properties.put("documentation", "");
        properties.put("isimmediate", "");
        properties.put("name", "");

        // Set resourceId
        connectorJson.put("resourceId", connectorNode.getId().trim());

        // Set stencil
        connectorJson.putObject("stencil").put("id", "SequenceFlow");

        // Set target
        connectorJson.putObject("target").put("resourceId", connectorNode.getTarget().trim());

        addChildShapes(outputJson, connectorJson);
    }

    void addChildShapes(ObjectNode outputJson, ObjectNode taskChildShape) {
        if(outputJson.has("childShapes")){
            ArrayNode childShapes = (ArrayNode) outputJson.get("childShapes");
            childShapes.add(taskChildShape);
        }else
            outputJson.putArray("childShapes").add(taskChildShape);
    }
}
