package com.precisely.pem.converter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.precisely.pem.commonUtil.ApplicationConstants;
import com.precisely.pem.dtos.BpmnConverterRequest;
import com.precisely.pem.dtos.Constants;
import com.precisely.pem.dtos.Node;
import com.precisely.pem.dtos.NodeTypes;

public class FormNodeHandler extends AbstractNodeHandler{
    @Override
    public void handleNode(Node node, ObjectNode outputJson, ObjectMapper objectMapper, BpmnConverterRequest request) {

        String type = node.getType();
        if(type.equalsIgnoreCase(NodeTypes.FORM.getName())){
            String id = node.getId();
            String name = node.getName();
            String description = node.getDescription();

            double x = node.getDiagram().getX();
            double y = node.getDiagram().getY();

            String userKeys = node.getUserKeys();
            String roleKeys = node.getRoleKeys();
            String parentId = node.getParentId();
            if(parentId!=null && !parentId.isEmpty()){
                userKeys = "${"+parentId+".userKey}";
                roleKeys = "${"+parentId+".roleKey}";
            }
            // Set EndNoneEvent
            ObjectNode userTaskChildShape = objectMapper.createObjectNode();
            ObjectNode userTaskShapeBounds = userTaskChildShape.putObject("bounds");
            userTaskShapeBounds.putObject("lowerRight").put("x", x + Constants.WIDTH).put("y", y + Constants.HEIGHT);
            userTaskShapeBounds.putObject("upperLeft").put("x", x).put("y", y);
            userTaskChildShape.putArray("childShapes");
            userTaskChildShape.putArray("dockers");
            ArrayNode outgoing = userTaskChildShape.putArray("outgoing");
            getOutGoingNode(request, id, outgoing);


            ObjectNode properties = userTaskChildShape.putObject("properties");
            properties.put("asynchronousdefinition","No");
            properties.put("bgcolor", "#ffffff");
            properties.put("bordercolor", "#000000");
            properties.put("callacitivity", "");
            properties.put("completioncondition", "");
            properties.put("documentation", description);
            properties.put("duedatedefinition", "");
            properties.put("exclusivedefinition", "Yes");
            properties.put("executionlisteners", "");
            properties.put("formkeydefinition", "");

            // Create the "formproperties" object
            ObjectNode formPropertiesNode = objectMapper.createObjectNode();

            // Create the items array
            ArrayNode itemsArray = objectMapper.createArrayNode();

            // Create the first form property
            ObjectNode formProperty = objectMapper.createObjectNode();
            formProperty.put("id", "form");
            formProperty.put("name", "form");
            formProperty.put("type", "string");
            formProperty.put("variable",node.getForm());
            itemsArray.add(formProperty);

            formProperty = objectMapper.createObjectNode();
            formProperty.put("id", "formNodeType");
            formProperty.put("name", "formNodeType");
            formProperty.put("type", "string");
            formProperty.put("variable", node.getFormNodeType() != null ? node.getFormNodeType() : ApplicationConstants.CUSTOM_FORM_NODE);
            itemsArray.add(formProperty);

            // Set the items array and totalCount in formPropertiesNode
            formPropertiesNode.set("formProperties", itemsArray);
            formPropertiesNode.put("totalCount", 1);

            properties.set("formproperties",formPropertiesNode);
            properties.put("name", name);
            properties.put("properties", "");


            // Create usertaskassignment structure
            ObjectNode userTaskAssignment = createUserTaskAssignment(objectMapper, userKeys, roleKeys);

            properties.set("usertaskassignment", userTaskAssignment);


            userTaskChildShape.put("resourceId", id);
            userTaskChildShape.putObject("stencil").put("id",NodeTypes.FORM.getBpmnName());

            addChildShapes(outputJson, userTaskChildShape);
        }else {
            passToNext(node, outputJson, objectMapper,request);
        }
    }

    private static ObjectNode createUserTaskAssignment(ObjectMapper objectMapper, String userKeys, String roleKeys) {
        ObjectNode assignment = objectMapper.createObjectNode();

        // Create candidateUsers array
        ArrayNode candidateUsers = objectMapper.createArrayNode();
        ObjectNode userNode = objectMapper.createObjectNode();
        userNode.put("value", userKeys);
        candidateUsers.add(userNode);
        assignment.set("candidateUsers", candidateUsers);

        // Create candidateGroups array
        ArrayNode candidateGroups = objectMapper.createArrayNode();
            ObjectNode groupNode = objectMapper.createObjectNode();
            groupNode.put("value", roleKeys);
            candidateGroups.add(groupNode);
        assignment.set("candidateGroups", candidateGroups);

        // Wrap in usertaskassignment
        ObjectNode userTaskAssignment = objectMapper.createObjectNode();
        userTaskAssignment.set("assignment", assignment);

        return userTaskAssignment;
    }


}
