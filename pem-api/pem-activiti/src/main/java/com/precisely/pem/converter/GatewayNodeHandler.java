package com.precisely.pem.converter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.precisely.pem.dtos.BpmnConverterRequest;
import com.precisely.pem.dtos.GatewayTypes;
import com.precisely.pem.dtos.Node;
import com.precisely.pem.dtos.NodeTypes;
import lombok.extern.log4j.Log4j2;

import java.util.Objects;

import static com.precisely.pem.dtos.Constants.HEIGHT;
import static com.precisely.pem.dtos.Constants.WIDTH;

@Log4j2
public class GatewayNodeHandler extends AbstractNodeHandler{
    @Override
    public void handleNode(Node node, ObjectNode outputJson, ObjectMapper objectMapper, BpmnConverterRequest request) {
        String type = node.getType();
        if(Objects.nonNull(type) && type.equalsIgnoreCase(NodeTypes.EXCLUSIVE_GATEWAY.getName())){
            String gatewayType = node.getGatewayType();
            NodeTypes nodeTypes = GatewayTypes.getGatewayType(gatewayType);
            if(Objects.isNull(nodeTypes)){
                log.error("No Gateway Type found for name {}", gatewayType);
                return;
            }
            String id = node.getId();
            String name = node.getName();
            String description = node.getDescription();

            double x = node.getDiagram().getX();
            double y = node.getDiagram().getY();


            ObjectNode gatewayChildShape = objectMapper.createObjectNode();
            ObjectNode bounds = gatewayChildShape.putObject("bounds");
            bounds.putObject("lowerRight").put("x", x + WIDTH).put("y", y + HEIGHT);
            bounds.putObject("upperLeft").put("x", x).put("y", y);
            gatewayChildShape.putArray("childShapes");
            gatewayChildShape.putArray("dockers");

            ArrayNode outgoing = gatewayChildShape.putArray("outgoing");
            getOutGoingNode(request, id, outgoing);
            ObjectNode properties = gatewayChildShape.putObject("properties");
            // Map input fields to output JSON
            properties.put("name", name);
            properties.put("documentation", description);

            gatewayChildShape.putObject("stencil").put("id", nodeTypes.getBpmnName());

            gatewayChildShape.put("resourceId", id);

            addChildShapes(outputJson,gatewayChildShape);

        }else {
            passToNext(node, outputJson, objectMapper,request);
        }
    }

}
