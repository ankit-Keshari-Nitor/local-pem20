package com.precisely.pem.converter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.precisely.pem.dtos.BpmnConverterRequest;
import com.precisely.pem.dtos.Node;
import com.precisely.pem.dtos.NodeTypes;
import com.precisely.pem.dtos.Variable;

import static com.precisely.pem.dtos.Constants.HEIGHT;
import static com.precisely.pem.dtos.Constants.WIDTH;

public class CallActivityNodeHandler extends AbstractNodeHandler {
    @Override
    public void handleNode(Node node, ObjectNode outputJson, ObjectMapper objectMapper, BpmnConverterRequest request) {
        String type = node.getType();
        if (type.equalsIgnoreCase(NodeTypes.CALL_ACTIVITY.getName())) {
            String id = node.getId();
            String name = node.getName();
            String description = node.getDescription();

            double x = node.getDiagram().getX();
            double y = node.getDiagram().getY();

            // Set Call Activity Node
            ObjectNode callActivityChildShape = objectMapper.createObjectNode();
            ObjectNode startChildShapeBounds = callActivityChildShape.putObject("bounds");
            startChildShapeBounds.putObject("lowerRight").put("x", x + WIDTH).put("y", y + HEIGHT);
            startChildShapeBounds.putObject("upperLeft").put("x", x).put("y", y);

            callActivityChildShape.putArray("childShapes");
            callActivityChildShape.putArray("dockers");

            ArrayNode outgoing = callActivityChildShape.putArray("outgoing");

            getOutGoingNode(request, id, outgoing);

            ObjectNode callActivityProperties = callActivityChildShape.putObject("properties");


            // Setting "callactivitycalledelement"
            callActivityProperties.put("callactivitycalledelement", node.getTargetActivity());//processId of target process

            // Setting "callactivityinparameters"
            ObjectNode callactivityinparameters = callActivityProperties.putObject("callactivityinparameters");
            ArrayNode inParameters = callactivityinparameters.putArray("inParameters");

            for (Variable inParam: node.getInVariables()){
                // Adding inParameters objects
                ObjectNode inParam1 = inParameters.addObject();
                inParam1.put("source", inParam.getSource());
                inParam1.put("target", inParam.getTarget());

            }
            // Setting totalCount for inParameters
            callactivityinparameters.put("totalCount", node.getInVariables().size());

            // Creating "callactivityoutparameters"
            ObjectNode callactivityoutparameters = callActivityProperties.putObject("callactivityoutparameters");
            ArrayNode outParameters = callactivityoutparameters.putArray("outParameters");

            for (Variable outParam: node.getOutVariables()){
                // Adding outParameters objects
                ObjectNode outParam1 = outParameters.addObject();
                outParam1.put("source", outParam.getSource());
                outParam1.put("target", outParam.getTarget());
            }

            // Setting totalCount for outParameters
            callactivityoutparameters.put("totalCount", node.getOutVariables().size());

            callActivityProperties.put("documentation", description);
            callActivityProperties.put("isforcompensation", "false");
            callActivityProperties.put("looptype", "None");
            callActivityProperties.put("name", name);

            callActivityChildShape.put("resourceId", id);// Identifier
            callActivityChildShape.putObject("stencil").put("id", "CallActivity");// Static identifier for Start Event

            addChildShapes(outputJson, callActivityChildShape);
        } else {
            passToNext(node, outputJson, objectMapper, request);
        }
    }
}
