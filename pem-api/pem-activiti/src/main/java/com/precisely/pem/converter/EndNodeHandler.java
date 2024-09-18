package com.precisely.pem.converter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.precisely.pem.dtos.BpmnConverterRequest;
import com.precisely.pem.dtos.Node;
import com.precisely.pem.dtos.NodeTypes;

import static com.precisely.pem.dtos.Constants.*;

public class EndNodeHandler extends AbstractNodeHandler{

    @Override
    public void handleNode(Node node, ObjectNode outputJson, ObjectMapper objectMapper, BpmnConverterRequest request) {
        String type = node.getType();
        if(type.equalsIgnoreCase(NodeTypes.END.getName())){
            String id =  node.getId();
            String name = node.getName();

            double x = node.getDiagram().getX();
            double y = node.getDiagram().getY();

            // Set EndNoneEvent
            ObjectNode endChildShape = objectMapper.createObjectNode();
            ObjectNode childShapeBounds = endChildShape.putObject("bounds");
            childShapeBounds.putObject("lowerRight").put("x", x +WIDTH).put("y", y +HEIGHT);
            childShapeBounds.putObject("upperLeft").put("x", x).put("y", y);

            endChildShape.putArray("childShapes");
            endChildShape.putArray("dockers");
            ArrayNode outgoing = endChildShape.putArray("outgoing");

            getOutGoingNode(request, id, outgoing);

            ObjectNode properties = endChildShape.putObject("properties");
            properties.put("bgcolor", "#ffffff");
            properties.put("bordercolor", "#000000");
            properties.put("dataoutput", "");
            properties.put("dataoutputassociations", "");
            properties.put("documentation", "");
            properties.put("executionlisteners", "");
            properties.put("formproperties", "");
            properties.put("initiator", "");
            properties.put("name", name);
            properties.put("outputset", "");
            properties.put("processid", "");
            properties.put("trigger", "None");

            endChildShape.put("resourceId", id); // Identifier
            endChildShape.putObject("stencil").put("id", "EndNoneEvent"); // Static identifier for End Event

            addChildShapes(outputJson, endChildShape);
        }else {
        passToNext(node, outputJson, objectMapper,request);
        }
    }

}
