package com.precisely.pem.converter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.precisely.pem.dtos.BpmnConverterRequest;
import com.precisely.pem.dtos.Node;
import com.precisely.pem.dtos.NodeTypes;
import com.precisely.pem.dtos.XsltConfiguration;
import org.apache.commons.lang3.StringUtils;

import static com.precisely.pem.dtos.Constants.*;

public class XsltNodeHandler extends AbstractNodeHandler{
    @Override
    public void handleNode(Node node, ObjectNode outputJson, ObjectMapper objectMapper, BpmnConverterRequest request) {
        String type = node.getType();
        if(type.equalsIgnoreCase(NodeTypes.XSLT_NODE.getName())){
            String id = node.getId();
            String name = node.getName();
            String description = node.getDescription();

            double x = node.getDiagram().getX();
            double y = node.getDiagram().getY();
            XsltConfiguration xslt = node.getXslt();

            ObjectNode xsltNodeChildShape = objectMapper.createObjectNode();
            ObjectNode bounds = xsltNodeChildShape.putObject("bounds");
            bounds.putObject("lowerRight").put("x", x + WIDTH).put("y", y + HEIGHT);
            bounds.putObject("upperLeft").put("x", x).put("y", y);

            xsltNodeChildShape.putArray("childShapes");
            xsltNodeChildShape.putArray("dockers");
            ArrayNode outgoing = xsltNodeChildShape.putArray("outgoing");
            getOutGoingNode(request, id, outgoing);

            ObjectNode properties = xsltNodeChildShape.putObject("properties");
            properties.put("asynchronousdefinition", "Yes");
            properties.put("documentation", "");
            properties.put("duedatedefinition", "");
            properties.put("exclusivedefinition", "No");
            properties.put("formkeydefinition", "");
            properties.put("formproperties", "");
            properties.put("isforcompensation", "false");
            properties.put("looptype", "None");
            properties.put("name", "");
            properties.put("prioritydefinition", "");
            properties.put("servicetaskclass", "com.precisely.pem.service.XsltTransformationDelegate");
            properties.put("servicetaskdelegateexpression", "");
            properties.put("servicetaskexpression", "");

            properties.put("tasklisteners", "");
            properties.put("type", "http://b3mn.org/stencilset/bpmn2.0#UserTask");
            properties.put("usertaskassignment", "");

            ObjectNode stencil = xsltNodeChildShape.putObject("stencil");
            stencil.put("id", NodeTypes.XSLT_NODE.getBpmnName());

            // Map input fields to output JSON
            properties.put("name", name);
            properties.put("documentation", description);
            xsltNodeChildShape.put("resourceId", id);

            ObjectNode servicetaskfields = properties.putObject("servicetaskfields");
            ArrayNode fields = servicetaskfields.putArray("fields");

            servicetaskfields.put("totalCount", 1);

            ObjectNode inputField = fields.addObject();
            inputField.put("name", XSLT_FIELD_INPUT);
            inputField.put("expression", xslt.getInput());

            ObjectNode inputXsltField = fields.addObject();
            inputXsltField.put("name", XSLT_FIELD_XSLT);
            inputXsltField.put("expression", xslt.getXslt());

            ObjectNode outputField = fields.addObject();
            outputField.put("name", XSLT_FIELD_OUTPUT);
            outputField.put("expression", xslt.getOutput());

            ObjectNode sampleOutputField = fields.addObject();
            sampleOutputField.put("name", XSLT_FIELD_SAMPLE_OUTPUT);
            sampleOutputField.put("expression", xslt.getOutput());

            ObjectNode typeField = fields.addObject();
            typeField.put("name", XSLT_FIELD_TYPE);
            typeField.put("expression", type);

            ObjectNode escapeInputField = fields.addObject();
            escapeInputField.put("name", XSLT_FIELD_ESCAPE_INPUT);
            escapeInputField.put("expression", StringUtils.isBlank(xslt.getEscapeInput()) ? "false" : xslt.getEscapeInput());

            addChildShapes(outputJson,xsltNodeChildShape);

        }else {
            passToNext(node, outputJson, objectMapper,request);
        }
    }

}
