package com.precisely.pem.converter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.precisely.pem.dtos.BpmnConverterRequest;
import com.precisely.pem.dtos.Node;
import com.precisely.pem.dtos.NodeTypes;

import static com.precisely.pem.dtos.Constants.*;

public class StartNodeHandler extends AbstractNodeHandler{
    @Override
    public void handleNode(Node node, ObjectNode outputJson, ObjectMapper objectMapper, BpmnConverterRequest request) {
        String type = node.getType();
        if(type.equalsIgnoreCase(NodeTypes.START.getName())){
            String id =  node.getId();
            String name = node.getName();

            double x = node.getDiagram().getX();
            double y = node.getDiagram().getY();

            // Set StartNoneEvent
            ObjectNode startEventChildShape = objectMapper.createObjectNode();
            ObjectNode startChildShapeBounds = startEventChildShape.putObject("bounds");
            startChildShapeBounds.putObject("lowerRight").put("x", x+WIDTH).put("y", y+HEIGHT);
            startChildShapeBounds.putObject("upperLeft").put("x", x).put("y", y);

            startEventChildShape.putArray("childShapes");
            startEventChildShape.putArray("dockers");

            ArrayNode outgoing = startEventChildShape.putArray("outgoing");

            getOutGoingNode(request, id, outgoing);

            ObjectNode startProperties = startEventChildShape.putObject("properties");
            startProperties.put("bgcolor", "#ffffff");
            startProperties.put("bordercolor", "#000000");
            startProperties.put("dataoutput", "");
            startProperties.put("dataoutputassociations", "");
            startProperties.put("documentation", "");
            startProperties.put("executionlisteners", "");
            startProperties.put("formproperties", "");
            startProperties.put("initiator", "");
            startProperties.put("name", name);
            startProperties.put("outputset", "");
            startProperties.put("processid", "");
            startProperties.put("trigger", "None");

            startEventChildShape.put("resourceId", id);// Identifier
            startEventChildShape.putObject("stencil").put("id", "StartNoneEvent");// Static identifier for Start Event

            addChildShapes(outputJson, startEventChildShape);
        }else {
            passToNext(node, outputJson, objectMapper, request);
        }
    }

}
