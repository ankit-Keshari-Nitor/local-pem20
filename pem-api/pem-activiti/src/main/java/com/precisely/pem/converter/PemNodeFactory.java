package com.precisely.pem.converter;

import com.precisely.pem.dtos.*;
import lombok.extern.log4j.Log4j2;
import org.activiti.bpmn.model.SubProcess;
import org.activiti.bpmn.model.*;
import org.apache.commons.lang3.StringUtils;

import java.util.*;
import java.util.function.BiFunction;
import java.util.stream.Collectors;

import static com.precisely.pem.converter.AbstractNodeHandler.createConnector;
import static com.precisely.pem.dtos.Constants.*;

@Log4j2
public class PemNodeFactory {
    private static final Map<Class<? extends FlowElement>, BiFunction<FlowElement,BpmnConverterRequest, Node>> nodeCreators = new HashMap<>();

    static {
        nodeCreators.put(StartEvent.class, PemNodeFactory::createStartNode);
        nodeCreators.put(EndEvent.class, PemNodeFactory::createEndNode);
        nodeCreators.put(UserTask.class, PemNodeFactory::createUserTaskNode);
        nodeCreators.put(ServiceTask.class, PemNodeFactory::createServiceTaskNode);
        nodeCreators.put(ExclusiveGateway.class, PemNodeFactory::createGatewayNode);
        nodeCreators.put(InclusiveGateway.class, PemNodeFactory::createGatewayNode);
        nodeCreators.put(SubProcess.class, PemNodeFactory::createSubProcessNode);
        nodeCreators.put(CallActivity.class, PemNodeFactory::createCallActivityNode);
    }

    public static Node createNode(FlowElement flowElement,BpmnConverterRequest bpmnConverterRequest) {
        return nodeCreators.getOrDefault(flowElement.getClass(),(fe, req) -> null).apply(flowElement,bpmnConverterRequest);
    }

    private static Node createStartNode(FlowElement flowElement,BpmnConverterRequest bpmnConverterRequest) {
        StartEvent startEvent = (StartEvent) flowElement;
        return Node.builder()
                .id(startEvent.getId())
                .name(startEvent.getName())
                .type(NodeTypes.START.getName())
                .build();
    }

    private static Node createEndNode(FlowElement flowElement,BpmnConverterRequest bpmnConverterRequest) {
        EndEvent endEvent = (EndEvent) flowElement;
        return Node.builder()
                .id(endEvent.getId())
                .name(endEvent.getName())
                .type(NodeTypes.END.getName())
                .build();
    }

    private static Node createUserTaskNode(FlowElement flowElement,BpmnConverterRequest bpmnConverterRequest) {
        UserTask userTask = (UserTask) flowElement;
        Node node = new Node();
        node.setId(userTask.getId());
        node.setName(userTask.getName());
        node.setType(NodeTypes.FORM.getName());
        List<FormProperty> formProperty= userTask.getFormProperties();
        for (FormProperty item : formProperty) {
            if (item.getName().equalsIgnoreCase("form")) {
                node.setForm(item.getVariable());
                break;
            }
        }
        node.setDescription(userTask.getDocumentation());
        node.setUserKeys(String.join(",", userTask.getCandidateUsers()));
        node.setRoleKeys(String.join(",", userTask.getCandidateGroups()));
        if(userTask.hasMultiInstanceLoopCharacteristics()){
            MultiInstanceLoopCharacteristics loop = userTask.getLoopCharacteristics();
            Looping looping = getLooping(loop);
            node.setLoop(looping);
        }
        return node;
    }

    private static Looping getLooping(MultiInstanceLoopCharacteristics loop) {
        return Looping.builder()
                .loopCardinality(loop.getLoopCardinality())
                .completionCondition(loop.getCompletionCondition())
                .dataItem(loop.getElementVariable())
                .loopDataInput(loop.getInputDataItem())
                .build();
    }

    private static Node createServiceTaskNode(FlowElement flowElement,BpmnConverterRequest bpmnConverterRequest) {
        ServiceTask serviceTask = (ServiceTask) flowElement;

        /**
         * create map with all the fields based on FieldName and its value
         * */
        Map<String, String> fieldValueMap = serviceTask.getFieldExtensions().stream().filter(fieldExtension ->Objects.nonNull( fieldExtension.getExpression()))
                .collect(Collectors.toMap(FieldExtension::getFieldName, FieldExtension::getExpression));
        String nodeType = fieldValueMap.get(API_FIELD_TYPE);

        if (nodeType.equalsIgnoreCase(NodeTypes.API_NODE.getName())) {
            Node node = new Node();
            node.setId(serviceTask.getId());
            node.setName(serviceTask.getName());
            node.setDescription(serviceTask.getDocumentation());
            node.setType(nodeType);

            ApiConfiguration apiConfiguration = new ApiConfiguration();
            apiConfiguration.setUrl(fieldValueMap.get(API_FIELD_URL));
            apiConfiguration.setApiConfiguration(fieldValueMap.get(API_FIELD_API_CONFIGURATION));
            apiConfiguration.setMethod(fieldValueMap.get(API_FIELD_METHOD));
            apiConfiguration.setRequestContentType(fieldValueMap.get(API_FIELD_REQUEST_CONTENT_TYPE));
            apiConfiguration.setResponseContentType(fieldValueMap.get(API_FIELD_RESPONSE_CONTENT_TYPE));
            apiConfiguration.setFile(fieldValueMap.get(API_FIELD_FILE));
            apiConfiguration.setRequestHeaders(fieldValueMap.get(API_FIELD_HEADERS));
            apiConfiguration.setRequest(fieldValueMap.get(API_FIELD_REQUEST_BODY));
            apiConfiguration.setSampleResponse(fieldValueMap.get(API_FIELD_SAMPLE_RESPONSE));
            apiConfiguration.setResponse(fieldValueMap.get(API_FIELD_RESPONSE_BODY));

            node.setApi(apiConfiguration);

            if(serviceTask.hasMultiInstanceLoopCharacteristics()){
                MultiInstanceLoopCharacteristics loop = serviceTask.getLoopCharacteristics();
                Looping looping = getLooping(loop);
                node.setLoop(looping);
            }
            return node;
        } else if (nodeType.equalsIgnoreCase(NodeTypes.XSLT_NODE.getName())) {
            Node node = new Node();
            node.setId(serviceTask.getId());
            node.setName(serviceTask.getName());
            node.setDescription(serviceTask.getDocumentation());
            node.setType(nodeType);

            XsltConfiguration xsltConfiguration = new XsltConfiguration();
            xsltConfiguration.setXslt(fieldValueMap.get(XSLT_FIELD_XSLT));
            xsltConfiguration.setOutput(fieldValueMap.get(XSLT_FIELD_OUTPUT));
            xsltConfiguration.setSampleOutput(fieldValueMap.get(XSLT_FIELD_OUTPUT));
            xsltConfiguration.setInput(fieldValueMap.get(XSLT_FIELD_INPUT));
            xsltConfiguration.setEscapeInput(fieldValueMap.get(XSLT_FIELD_ESCAPE_INPUT));

            node.setXslt(xsltConfiguration);

            if(serviceTask.hasMultiInstanceLoopCharacteristics()){
                MultiInstanceLoopCharacteristics loop = serviceTask.getLoopCharacteristics();
                Looping looping = getLooping(loop);
                node.setLoop(looping);
            }
            return node;
        }
        return null;
    }

    private static Node createGatewayNode(FlowElement flowElement,BpmnConverterRequest bpmnConverterRequest) {
        Gateway gateway = (Gateway) flowElement;

        Node node = new Node();
        node.setId(gateway.getId());
        node.setName(gateway.getName());
        node.setDescription(gateway.getDocumentation());
        node.setGatewayType(getExtensionElementsText(gateway, CustomElementTextType.TYPE));
        node.setType(NodeTypes.EXCLUSIVE_GATEWAY.getName());
        return node;
    }

    //We have to make sure whatever order we have added the ExtensionElements in getStringExtensionElement, with that same index we call this method to get its ElementText.
    private static String getExtensionElementsText(FlowElement flowElement, CustomElementTextType customElementTextType) {
        try {
            Map<String,List<ExtensionElement>> extensions = flowElement.getExtensionElements();
            String fieldPrefix = "activiti:field";
            String stringPrefix = "activiti:string";
            if(Objects.isNull(extensions.get("activiti:field")) && extensions.get("activiti:field").isEmpty()){
                fieldPrefix = "field";
                stringPrefix = "string";
            }

            for (ExtensionElement extensionElement : extensions.get(fieldPrefix)) {
                Map<String,List<ExtensionAttribute>> attributes = extensionElement.getAttributes();
                String name = attributes.get(EXTENSION_ELEMENT_NAME).get(0).getValue();
                if (customElementTextType.getName().equalsIgnoreCase(name)){
                    return extensionElement.getChildElements().get(stringPrefix).get(0).getElementText();
                }
            }
        }catch (Exception exception){
            log.error("{} FlowElement ElementText read failed", flowElement.getId());
        }
        return null;
    }

    private static Node createSubProcessNode(FlowElement subFlowElement,BpmnConverterRequest bpmnConverterRequest){
        Node node = new Node();
        List<Node> nodes = new ArrayList<>();
        SubProcess subProcess = (SubProcess) subFlowElement;
        node.setId(subProcess.getId());
        node.setName(subProcess.getName());
        node.setType(getExtensionElementsText(subProcess,CustomElementTextType.TYPE));// we have always added Type as first element in addExtensionElementsToSubProcess.
        node.setDescription(subProcess.getDocumentation());

        if(subProcess.hasMultiInstanceLoopCharacteristics()){
            MultiInstanceLoopCharacteristics loop = subProcess.getLoopCharacteristics();
            Looping looping = getLooping(loop);
            node.setLoop(looping);
        }

        String estimateDays = getExtensionElementsText(subProcess,CustomElementTextType.ESTIMATE_DAYS);
        node.setEstimateDays(StringUtils.isNumeric(estimateDays) ? Integer.parseInt(estimateDays) : null );
        if (NodeTypes.SPONSOR_SUB_PROCESS.getName().equalsIgnoreCase(node.getType())){
            node.setShowToPartner(Boolean.parseBoolean(getExtensionElementsText(subProcess,CustomElementTextType.SHOW_TO_PARTNER)));
        }

        List<Connector> connectors = new ArrayList<>();
        for (FlowElement sub : subProcess.getFlowElements()) {

            if(sub instanceof UserTask){
                String id = sub.getId();
                if(id.contains(Constants.SYSTEM_USER_TASK)){
                    node.setUserKeys(String.join(",", ((UserTask)sub).getCandidateUsers()));
                    node.setRoleKeys(String.join(",", ((UserTask)sub).getCandidateGroups()));
                    continue;
                }
            }
            //For SubProcess we need to add Connectors at time of NodeConversion into each SubProcess node itself.
            if(sub instanceof SequenceFlow sequenceFlow){
                assert bpmnConverterRequest.getBpmnModel() != null;
                connectors.add(createConnector(sequenceFlow,bpmnConverterRequest.getBpmnModel()));
            }

            //Recursive Call which creates SubNode again.
            Node subNode = PemNodeFactory.createNode(sub,bpmnConverterRequest);
            GraphicInfo childLocation = bpmnConverterRequest.getBpmnModel().getLocationMap().get(sub.getId());
            BpmnModel bpmnModel = bpmnConverterRequest.getBpmnModel();
            if (subNode != null && bpmnModel != null) {
                GraphicInfo parentLocation = bpmnModel.getLocationMap().get(subFlowElement.getId());
                if (parentLocation != null) {
                    subNode.setDiagram(Diagram.builder().x(childLocation.getX()-parentLocation.getX()).y(childLocation.getY()-parentLocation.getY()).build());
                }
                nodes.add(subNode);
            }
        }
        node.setConnectors(connectors);
        node.setNodes(nodes);
        return node;
    }

    private static Node createCallActivityNode(FlowElement flowElement, BpmnConverterRequest bpmnConverterRequest){
        Node node = new Node();
        CallActivity callActivity = (CallActivity) flowElement;
        node.setId(callActivity.getId());
        node.setName(callActivity.getName());
        node.setType(NodeTypes.CALL_ACTIVITY.getName());
        node.setTargetActivity(((CallActivity) flowElement).getCalledElement());
        List<Variable> inVariables = ((CallActivity) flowElement).getInParameters().stream()
                .map(data -> Variable.builder()
                        .target(data.getTarget())
                        .source(data.getSource())
                        .build())
                .collect(Collectors.toList());
        node.setInVariables(inVariables);

        List<Variable> outVariables = ((CallActivity) flowElement).getOutParameters().stream()
                .map(data -> Variable.builder()
                        .target(data.getTarget())
                        .source(data.getSource())
                        .build())
                .collect(Collectors.toList());
        node.setOutVariables(outVariables);

        if(callActivity.hasMultiInstanceLoopCharacteristics()){
            MultiInstanceLoopCharacteristics loop = callActivity.getLoopCharacteristics();
            Looping looping = getLooping(loop);
            node.setLoop(looping);
        }

        return node;
    }
}

