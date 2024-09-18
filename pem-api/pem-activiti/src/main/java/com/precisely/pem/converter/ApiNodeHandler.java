package com.precisely.pem.converter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.precisely.pem.dtos.*;

import static com.precisely.pem.dtos.Constants.*;

public class ApiNodeHandler extends AbstractNodeHandler{


    @Override
    public void handleNode(Node node, ObjectNode outputJson, ObjectMapper objectMapper, BpmnConverterRequest request) {
        String type = node.getType();
        if(type.equalsIgnoreCase(NodeTypes.API_NODE.getName())){
            String id = node.getId();
            String name = node.getName();
            String description = node.getDescription();

            double x = node.getDiagram().getX();
            double y = node.getDiagram().getY();
            ApiConfiguration api = node.getApi();

            // Set EndNoneEvent
            ObjectNode apiNodeChildShape = objectMapper.createObjectNode();
            ObjectNode bounds = apiNodeChildShape.putObject("bounds");
            bounds.putObject("lowerRight").put("x", x+ Constants.WIDTH).put("y", y+ Constants.HEIGHT);
            bounds.putObject("upperLeft").put("x", x).put("y", y);

            apiNodeChildShape.putArray("childShapes");
            apiNodeChildShape.putArray("dockers");
            ArrayNode outgoing = apiNodeChildShape.putArray("outgoing");

            getOutGoingNode(request, id, outgoing);

            ObjectNode properties = apiNodeChildShape.putObject("properties");
            properties.put("asynchronousdefinition", "Yes");
            properties.put("exclusivedefinition", "No");
            properties.put("formkeydefinition", "");
            properties.put("formproperties", "");
            properties.put("isforcompensation", "false");
            properties.put("looptype", "None");
            properties.put("servicetaskclass", "com.precisely.pem.service.RestTemplateApiService");
            properties.put("usertaskassignment", "");

            apiNodeChildShape.put("resourceId", "servicetask");
            ObjectNode stencil = apiNodeChildShape.putObject("stencil");
            stencil.put("id", NodeTypes.API_NODE.getBpmnName());

            // Map input fields to output JSON
            properties.put("name", name);
            properties.put("documentation", description);
            apiNodeChildShape.put("resourceId", id);

            ObjectNode servicetaskfields = properties.putObject("servicetaskfields");
            ArrayNode fields = servicetaskfields.putArray("fields");

            servicetaskfields.put("totalCount", 1);

            //create field for each API Configuration
            ObjectNode apiConfigurationField = fields.addObject();
            apiConfigurationField.put("name", API_FIELD_API_CONFIGURATION);
            apiConfigurationField.put("expression", api.getApiConfiguration());

            ObjectNode urlField = fields.addObject();
            urlField.put("name", API_FIELD_URL);
            urlField.put("expression", api.getUrl());

            ObjectNode methodField = fields.addObject();
            methodField.put("name", API_FIELD_METHOD);
            methodField.put("expression", api.getMethod());

            ObjectNode requestContentTypeField = fields.addObject();
            requestContentTypeField.put("name", API_FIELD_REQUEST_CONTENT_TYPE);
            requestContentTypeField.put("expression", api.getRequestContentType());

            ObjectNode responseContentTypeField = fields.addObject();
            responseContentTypeField.put("name", API_FIELD_RESPONSE_CONTENT_TYPE);
            responseContentTypeField.put("expression", api.getResponseContentType());

            ObjectNode headersField = fields.addObject();
            headersField.put("name", API_FIELD_HEADERS);
            headersField.put("expression", api.getRequestHeaders());

            ObjectNode requestBodyField = fields.addObject();
            requestBodyField.put("name", API_FIELD_REQUEST_BODY);
            requestBodyField.put("expression", api.getRequest());

            ObjectNode sampleResponseField = fields.addObject();
            sampleResponseField.put("name", API_FIELD_SAMPLE_RESPONSE);
            sampleResponseField.put("expression", api.getSampleResponse());

            ObjectNode responseBodyField = fields.addObject();
            responseBodyField.put("name", API_FIELD_RESPONSE_BODY);
            responseBodyField.put("expression", api.getResponse());

            ObjectNode typeField = fields.addObject();
            typeField.put("name", API_FIELD_TYPE);
            typeField.put("expression", type);

            ObjectNode fileField = fields.addObject();
            fileField.put("name", API_FIELD_FILE);
            fileField.put("expression", api.getFile());

            addChildShapes(outputJson,apiNodeChildShape);
        }else {
            passToNext(node, outputJson, objectMapper,request);
        }
    }

}
