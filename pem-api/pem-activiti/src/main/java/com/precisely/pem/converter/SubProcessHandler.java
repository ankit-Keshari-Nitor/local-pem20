package com.precisely.pem.converter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.precisely.pem.dtos.BpmnConverterRequest;
import com.precisely.pem.dtos.Node;
import com.precisely.pem.dtos.NodeTypes;
import com.precisely.pem.service.BpmnConvertService;
import com.precisely.pem.service.BpmnConvertServiceImpl;

import java.util.List;
import java.util.Objects;

import static com.precisely.pem.dtos.Constants.HEIGHT;
import static com.precisely.pem.dtos.Constants.WIDTH;

public class SubProcessHandler extends AbstractNodeHandler {
    @Override
    public void handleNode(Node node, ObjectNode outputJson, ObjectMapper objectMapper, BpmnConverterRequest request) {
        String type = node.getType();
        BpmnConvertService bpmnConvertService = new BpmnConvertServiceImpl();
        if(isSubProcess(type)){
            String id =  node.getId();
            String name = node.getName();
            String description = node.getDescription();

            double x = node.getDiagram().getX();
            double y = node.getDiagram().getY();

            // Set EndNoneEvent
            ObjectNode subProcessChildShape = objectMapper.createObjectNode();
            ObjectNode userTaskShapeBounds = subProcessChildShape.putObject("bounds");
            userTaskShapeBounds.putObject("lowerRight").put("x", x + WIDTH).put("y", y + HEIGHT);
            userTaskShapeBounds.putObject("upperLeft").put("x", x).put("y", y);
            subProcessChildShape.putArray("dockers");
            ArrayNode outgoing = subProcessChildShape.putArray("outgoing");
            getOutGoingNode(request, id, outgoing);

            ObjectNode properties = subProcessChildShape.putObject("properties");
            // Map input fields to output JSON
            properties.put("name", type+"-"+name);
            properties.put("documentation",description);

            //Recursive Call: This will create Complete Cycle of Nodes within this subNode.
            ObjectNode subNodeOutputJson = generateSubProcessNode(node, objectMapper, request, bpmnConvertService);

            subProcessChildShape.set("childShapes",subNodeOutputJson.get("childShapes"));

            subProcessChildShape.putObject("stencil").put("id", NodeTypes.PARTNER_SUB_PROCESS.getBpmnName());// all has same BPMN Name i.e SubProcess

            subProcessChildShape.put("resourceId", id);

            addChildShapes(outputJson,subProcessChildShape);
        }else {
        passToNext(node, outputJson, objectMapper, request);
    }
    }

    private ObjectNode generateSubProcessNode(Node node, ObjectMapper objectMapper, BpmnConverterRequest request, BpmnConvertService bpmnConvertService) {
        ObjectNode subNodeOutputJson = objectMapper.createObjectNode();
        if(Objects.nonNull(node.getNodes()) && !node.getNodes().isEmpty()){
            List<Node> subNodes = node.getNodes();
            // Create and configure the chain of responsibility
            NodeHandler startEventNodeHandler = bpmnConvertService.createNodeHandlerChain();
            // Process each node through the chain
            for (Node subNode : subNodes) {
                if(isPartnerOrSponsorProcess(node.getType())){
                    subNode.setParentId(node.getId());
                }
                startEventNodeHandler.handleNode(subNode, subNodeOutputJson, objectMapper, request);
            }
        }
        return subNodeOutputJson;
    }
}
