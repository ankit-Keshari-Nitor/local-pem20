package com.precisely.pem.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.precisely.pem.commonUtil.ApplicationConstants;
import com.precisely.pem.converter.*;
import com.precisely.pem.dtos.*;
import com.precisely.pem.exceptionhandler.BpmnConverterException;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import com.precisely.pem.exceptionhandler.SchemaValidationDto;
import com.precisely.pem.exceptionhandler.SchemaValidationException;
import lombok.extern.log4j.Log4j2;
import org.activiti.bpmn.converter.BpmnXMLConverter;
import org.activiti.bpmn.model.Process;
import org.activiti.bpmn.model.SubProcess;
import org.activiti.bpmn.model.*;
import org.activiti.editor.language.json.converter.BpmnJsonConverter;
import org.activiti.engine.impl.util.json.JSONObject;
import org.activiti.validation.ProcessValidator;
import org.activiti.validation.ProcessValidatorFactory;
import org.activiti.validation.ValidationError;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;

import javax.sql.rowset.serial.SerialBlob;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.SecureRandom;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;

import static com.precisely.pem.converter.AbstractNodeHandler.createConnector;
import static com.precisely.pem.converter.AbstractNodeHandler.isSubProcess;
import static com.precisely.pem.dtos.Constants.*;

@Log4j2
@Service
public class BpmnConvertServiceImpl implements BpmnConvertService{

    ObjectMapper objectMapper = new ObjectMapper();

    public BpmnConvertServiceImpl(){
        /*
        FAIL_ON_UNKNOWN_PROPERTIES: Set false to allow the ObjectMapper to ignore unknown properties in the JSON data, instead of throwing an exception.
        JsonInclude.Include.NON_NULL: Set to exclude null values from being serialized in the output
        SerializationFeature.FAIL_ON_EMPTY_BEANS:it tells the ObjectMapper to not throw an exception when it encounters an empty bean. Instead, it will serialize the empty bean as an empty JSON object {}
        * */
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL)
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                .configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
    }

    /*This will convert pem_bpmn_json into bpmn xml definition and return BLOB which will be saved in DB.*/
    @Override
    public Blob getBpmnConvertedBlob(InputStream is,BpmnConverterRequest bpmnConverterRequest) throws IOException, SQLException, BpmnConverterException, SchemaValidationException {
        log.debug("======= Bpmn XML definition generated Successfully.");
        return new SerialBlob(getBpmnConvertedInbyte(is,bpmnConverterRequest));
    }

    @Override
    public byte[] getBpmnConvertedInbyte(InputStream is, BpmnConverterRequest bpmnConverterRequest) throws IOException, SQLException, BpmnConverterException, SchemaValidationException {
        PemBpmnModel pemBpmnModel;
        try(InputStream inputStream = is) {
            pemBpmnModel  = objectMapper.readValue(inputStream, PemBpmnModel.class);
        }
        if(Objects.isNull(pemBpmnModel))
            throw new BpmnConverterException("ConvertToBpmnDefinition", "Reading Json file failed.");

        //Modify and Add the conditions to the Connectors.
        ConditionHandler conditionHandler = new ConditionHandler();
        conditionHandler.refactorConnectorConditions(pemBpmnModel);

        BpmnModel bpmnModel = convertIntoBpmnDefinition(pemBpmnModel,bpmnConverterRequest);

        if(Objects.isNull(bpmnModel))
            throw new BpmnConverterException("ConvertToBpmnDefinition", "Convert To BPMN Definition Failed.");

        List<ValidationError> validationErrors = validateBpmnModel(bpmnModel);
        if (!validationErrors.isEmpty()) {
            List<SchemaValidationDto> messages = validationErrors.stream().map(p -> new SchemaValidationDto(null, null, p.toString())).toList();
            throw new SchemaValidationException(messages);
        }

        return generateBpmnXml(bpmnModel);
    }

    private byte[] generateBpmnXml(BpmnModel bpmnModel){
        // Create the BpmnXMLConverter
        BpmnXMLConverter bpmnXMLConverter = new BpmnXMLConverter();

        // Convert the BpmnModel to XML
        return bpmnXMLConverter.convertToXML(bpmnModel);
    }

    /*This method will accept bmn xml definition in Blob and convert into pem bpmn json and return InputStreamResource which will be return to UI.*/
    @Override
    public InputStreamResource getPemBpmnJsonData(Blob activityDefnData) throws SQLException, XMLStreamException, IOException {
        PemBpmnModel pemBpmnModel = getPemBpmnModel(activityDefnData);
        String jsonString = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(pemBpmnModel);
        InputStream bpmnModelToJsonStream = new ByteArrayInputStream(jsonString.getBytes());
        return new InputStreamResource(bpmnModelToJsonStream);
    }

    public PemBpmnModel getPemBpmnModel(Blob activityDefnData) throws SQLException, XMLStreamException {
        BpmnModel bpmnModel = getBpmnModel(activityDefnData);

        //This will convert BPMN Model into PemBpmnModel object.
        log.debug("Conversion of Bpmn Model into Pem Bpmn Model started.");
        return convertToPemProcess(bpmnModel, BpmnConverterRequest.builder().build());
    }

    @Override
    public BpmnModel getBpmnModel(Blob activityDefnData) throws SQLException, XMLStreamException {
        InputStream inputStream = activityDefnData.getBinaryStream();

        XMLInputFactory xmlInputFactory = XMLInputFactory.newInstance();
        XMLStreamReader xmlStreamReader = xmlInputFactory.createXMLStreamReader(inputStream);

        BpmnXMLConverter bpmnXMLConverter = new BpmnXMLConverter();
        return bpmnXMLConverter.convertToBpmnModel(xmlStreamReader);
    }

    public BpmnModel convertIntoBpmnDefinition(PemBpmnModel pemBpmnModel, BpmnConverterRequest bpmnConverterRequest) throws BpmnConverterException  {
        List<Node> nodes = pemBpmnModel.getProcess().getNodes();

        if (!nodes.isEmpty()) {

            //Merge all SubProcess Connectors into Global List as Activiti framework will accept.
            List<Connector> subConnectors = new ArrayList<>(pemBpmnModel.getProcess().getConnectors());
            mergeSubConnectors(nodes, subConnectors);
            pemBpmnModel.getProcess().setConnectors(subConnectors);

            // Create the output JSON structure
            ObjectNode outputJson = objectMapper.createObjectNode();

            // Set bounds for Canvas, can be static
            ObjectNode bounds = outputJson.putObject("bounds");
            bounds.putObject("lowerRight").put("x", 2000).put("y", 2000);
            bounds.putObject("upperLeft").put("x", 0).put("y", 0);

            // Create and configure the chain of responsibility
            NodeHandler nodeHandlerChain = createNodeHandlerChain();

            //Maintain all the SequenceFlow resourceIds which are source to each resource like Start, End , UI Dialog
            List<Connector> connectors = pemBpmnModel.getProcess().getConnectors();
            Map<String,List<String>> sourceMap = new HashMap<>();
            Map<String, Connector> connectorsMap = new HashMap<>();
            //Set Random System ID for each connector
            for (Connector connector : connectors) {
                connector.setId(CONNECTOR_ID_PREFIX +new SecureRandom().nextLong()+System.currentTimeMillis());
            }
            for (Connector connector : connectors) {
                String source = connector.getSource();
                List<String> connectorIds = sourceMap.getOrDefault(source,new ArrayList<>());
                connectorIds.add(connector.getId());
                sourceMap.put(source,connectorIds);
                connectorsMap.put(connector.getId(),connector);
            }
            bpmnConverterRequest.setConnectorsMap(connectorsMap);
            bpmnConverterRequest.setSourceMap(sourceMap);

            //Map nodeId with each node.
            Map<String, Node> nodeMap = new HashMap<>();
            for (Node node : nodes){
                nodeMap.put(node.getId(),node);
                if(AbstractNodeHandler.isSubProcess(node.getType())){
                    appendSubProcessNodesInNodeMap(node.getNodes(),nodeMap);
                }
            }

            SequenceFlowHandler sequenceFlowHandler = new SequenceFlowHandler();

            //Mandatory userKeys and roleKeys, each subprocess has startNode present always
            nodes.stream()
                    .filter(node -> (AbstractNodeHandler.isSubProcess(node.getType()) && !AbstractNodeHandler.isSystemSubProcess(node.getType())))
                    .forEach(node -> addDefaultSystemUserTaskForAllSubProcess(node.getNodes(),connectors, bpmnConverterRequest,node.getUserKeys(),node.getRoleKeys()));
            log.debug("======= Default System User Task For All SubProcess is added Successfully in PemBpmnModel body. ");
            // Process each node through the chain
            for (Node node : nodes) {
                nodeHandlerChain.handleNode(node, outputJson, objectMapper,bpmnConverterRequest);
            }
            log.debug("======= Creation of BPMN Json format for Nodes completed.");
            //Convert Connectors into Sequence Flow; connectors is not Node that's why not in Node's Chain
            for (Connector connectorNode : connectors) {
                sequenceFlowHandler.handleSequenceFlow(connectorNode,outputJson,objectMapper,bpmnConverterRequest);
            }
            log.debug("======= Creation of BPMN Json format for Connectors completed.");
            // Set properties for canvas
            setPropertiesForCanvas(outputJson,pemBpmnModel,bpmnConverterRequest);

            BpmnModel bpmnModel = new BpmnJsonConverter().convertToBpmnModel(outputJson);
            log.debug("======= Conversion of BPMN Json format into BPMN XML definition completed.");

            //Add custom fields in BpmnModel, fields for which we don't have BPMN JSON variable we have to manually add that in bpmn model.
            addCustomFieldsInBpmnModel(bpmnModel, nodeMap);
            log.debug("======= Add custom fields in BpmnModel completed.");

            addContextData(bpmnModel,pemBpmnModel,bpmnConverterRequest);
            log.debug("======= Add context Data information in BpmnModel completed.");
            return bpmnModel;
        }
        return null;
    }

    private void appendSubProcessNodesInNodeMap(List<Node> nodes,Map<String, Node> nodeMap) {
        nodes.forEach(subNode -> {
            nodeMap.put(subNode.getId(),subNode);
            if(Objects.nonNull(subNode.getNodes())){
                appendSubProcessNodesInNodeMap(subNode.getNodes(),nodeMap);
            }
        });
    }

    private void mergeSubConnectors(List<Node> nodes, List<Connector> connectors) {
        nodes.stream().filter(node -> ( AbstractNodeHandler.isSubProcess(node.getType()) )).forEach(node -> {
            node.getConnectors().forEach(subConnector -> {
                subConnector.setParent(node.getId());
                connectors.add(subConnector);
            });
            if (Objects.nonNull(node.getNodes())){
                mergeSubConnectors(node.getNodes(),connectors);
            }
        });
    }

    private void addContextData(BpmnModel bpmnModel, PemBpmnModel pemBpmnModel,BpmnConverterRequest bpmnConverterRequest)throws BpmnConverterException  {
        Process process = bpmnModel.getProcessById(bpmnConverterRequest.getProcessId());
        if(!StringUtils.isBlank(pemBpmnModel.getProcess().getContextData())){
            process.addExtensionElement(addStringExtensionElement(PROCESS_FIELD_CONTEXT_DATA, validateAndGetContextData(pemBpmnModel)));
        }

        pemBpmnModel.getProcess().getNodes().forEach(node -> {
            if(NodeTypes.API_NODE.getName().equalsIgnoreCase(node.getType())){
                //generating {"sampleResponse":<sampledata>} JSON string
                String resultJsonString = "{\""+API_FIELD_SAMPLE_RESPONSE+"\":"+node.getApi().getSampleResponse()+"}";
                process.addExtensionElement(addStringExtensionElement(node.getId(),resultJsonString));
            }else if(NodeTypes.XSLT_NODE.getName().equalsIgnoreCase(node.getType())){
                //generating {"sampleResponse":<sampledata>} JSON string
                String resultJsonString = "{\""+XSLT_FIELD_SAMPLE_OUTPUT+"\":"+node.getXslt().getSampleOutput()+"}";
                process.addExtensionElement(addStringExtensionElement(node.getId(),resultJsonString));
            }
        });
    }

    private String validateAndGetContextData(PemBpmnModel pemBpmnModel) throws BpmnConverterException {
        try {
            // Parse and validate the JSON string
            objectMapper.readTree(pemBpmnModel.getProcess().getContextData());
        } catch (Exception e) {
            log.error("Invalid Context Data JSON: " + e.getMessage());
            throw new BpmnConverterException("ConvertToBpmnDefinition", "Invalid Context Data JSON.");
        }
        return pemBpmnModel.getProcess().getContextData();
    }

    /* This will add UserTask from System Side into each subprocess. There should be Start Node in subprocess.*/
    private void addDefaultSystemUserTaskForAllSubProcess(List<Node> subProcessNodes,List<Connector> connectors,BpmnConverterRequest request,String userKeys,String roleKeys) {

        //No SubProcess is present for this Node execution
        if(Objects.isNull(subProcessNodes)){
            return;
        }
        List<Node> newNodes = new ArrayList<>();
       for(Node node : subProcessNodes) {
            if(NodeTypes.START.getName().equalsIgnoreCase(node.getType())){
                Node formNode = new FormNode();
                formNode.setId(SYSTEM_USER_TASK +Math.random());
                formNode.setName(SYSTEM_USER_TASK_NAME);
                formNode.setType(NodeTypes.FORM.getName());
                formNode.setDiagram(Diagram.builder()
                        .x(node.getDiagram().getX()+SYSTEM_USER_TASK_POS)
                        .y(node.getDiagram().getY()+SYSTEM_USER_TASK_POS).build());
                formNode.setUserKeys(Objects.isNull(userKeys) ? "" : userKeys);
                formNode.setRoleKeys(Objects.isNull(roleKeys) ? "" : roleKeys);
                formNode.setFormNodeType(ApplicationConstants.AUTO_FORM_NODE);
                newNodes.add(formNode);

                Connector newConnector = new Connector();
                newConnector.setId(SYSTEM_CONNECTOR+Math.random());
                newConnector.setSource(formNode.getId());

                List<String> connectorIds = request.getSourceMap().get(node.getId());//get Connectors associated with StartNode
                Connector connector = request.getConnectorsMap().get(connectorIds.get(0));//Use first found Connector of StartNode.
                newConnector.setTarget(connector.getTarget());//Set Existing Connector's Target to new Connector's Target
                connector.setTarget(formNode.getId());//set tart of Existing Connector's with new FormNode

                List<String> newConnectors = new ArrayList<>();
                newConnectors.add(newConnector.getId());
                request.getSourceMap().put(formNode.getId(),newConnectors);//Added newly created FormNode into Source-ConnectorIds map.

                request.getConnectorsMap().put(newConnector.getId(), newConnector);//Update ConnectorMap

                newConnector.setDiagram(connector.getDiagram());

                //add new connector in Connectors List
                connectors.add(newConnector);
            }else if(isSubProcess(node.getType()) && !AbstractNodeHandler.isSystemSubProcess(node.getType())){
                addDefaultSystemUserTaskForAllSubProcess(node.getNodes(),connectors,request, node.getUserKeys(), node.getRoleKeys());
            }
        }
       subProcessNodes.addAll(newNodes);
    }

    private void addCustomFieldsInBpmnModel(BpmnModel bpmnModel, Map<String, Node> nodeMap) throws BpmnConverterException {
        List<Process> processes = bpmnModel.getProcesses();
        for (Process process : processes) {
            for (FlowElement flowElement : process.getFlowElements()) {
                if ((flowElement instanceof ExclusiveGateway) || (flowElement instanceof InclusiveGateway)) {
                    Gateway gateway = (Gateway) flowElement;
                    String gatewayType = nodeMap.get(gateway.getId()).getGatewayType();
                    ExtensionElement fieldElement = addStringExtensionElement(CustomElementTextType.TYPE.getName(), gatewayType);
                    gateway.addExtensionElement(fieldElement);
                }
            }
            //For SubProcess because this will need a recursive
            addExtensionElementsToSubProcess(nodeMap, process.getFlowElements());

        }
    }

    private void addExtensionElementsToSubProcess(Map<String, Node> nodeMap, Collection<FlowElement> subProcessList) throws BpmnConverterException {

        for(FlowElement flowElement : subProcessList){
            if(!(flowElement instanceof SequenceFlow)) {
                Node node = nodeMap.get(flowElement.getId());
                if (flowElement instanceof SubProcess subProcess) {
                    ExtensionElement fieldElementType = addStringExtensionElement(CustomElementTextType.TYPE.getName(), node.getType());
                    subProcess.addExtensionElement(fieldElementType);
                    if (Objects.nonNull(node.getEstimateDays())) {
                        ExtensionElement fieldElement = addStringExtensionElement(CustomElementTextType.ESTIMATE_DAYS.getName(), node.getEstimateDays().toString());
                        subProcess.addExtensionElement(fieldElement);
                    }
                    if (NodeTypes.SPONSOR_SUB_PROCESS.getName().equalsIgnoreCase(node.getType())) {
                        ExtensionElement fieldElement = addStringExtensionElement(CustomElementTextType.SHOW_TO_PARTNER.getName(), node.getShowToPartner().toString());
                        subProcess.addExtensionElement(fieldElement);
                    }
                    if (validateLoopingCondition(node)) {
                        addLooping(flowElement,node);
                    }

                    if (Objects.nonNull(node.getNodes())) {
                        addExtensionElementsToSubProcess(nodeMap, subProcess.getFlowElements());
                    }
                } else if (validateLoopingCondition(node)) {
                    addLooping(flowElement,node);
                }
            }
        }
    }

    private boolean validateLoopingCondition(Node node) throws BpmnConverterException {
        if (Objects.isNull(node) || Objects.isNull(node.getLoop())){
            return false;
        }
        boolean loopingCondition = Objects.nonNull(node.getLoop().getLoopCardinality()) ||
                (Objects.nonNull(node.getLoop().getLoopDataInput()) && Objects.nonNull(node.getLoop().getDataItem()));
        if (!loopingCondition){
            throw new BpmnConverterException("ConvertToBpmnDefinition", "Required field for Looping is not available: {}", node.getId());
        }
        return true;
    }

    private void addLooping(FlowElement flowElement,Node node) {
        MultiInstanceLoopCharacteristics characteristics = new MultiInstanceLoopCharacteristics();
        characteristics.setSequential(Boolean.TRUE);
        characteristics.setCompletionCondition(node.getLoop().getCompletionCondition());
        if(Objects.nonNull(node.getLoop().getLoopCardinality())){
            characteristics.setLoopCardinality(node.getLoop().getLoopCardinality());
        }else {
            characteristics.setInputDataItem(node.getLoop().getLoopDataInput());
            characteristics.setElementVariable(node.getLoop().getDataItem());
        }
        addMultiInstanceLoopCharacteristics(flowElement,characteristics);
    }

    private void addMultiInstanceLoopCharacteristics(FlowElement flowElement,MultiInstanceLoopCharacteristics loopCharacteristics){
        if (flowElement instanceof UserTask){
            ((UserTask)flowElement).setLoopCharacteristics(loopCharacteristics);
        }else if (flowElement instanceof ServiceTask){
            ((ServiceTask)flowElement).setLoopCharacteristics(loopCharacteristics);
        }else if (flowElement instanceof SubProcess){
            ((SubProcess)flowElement).setLoopCharacteristics(loopCharacteristics);
        }else if (flowElement instanceof CallActivity){
            ((CallActivity)flowElement).setLoopCharacteristics(loopCharacteristics);
        }
    }

    /* activiti:field & activiti:string is name of field added as Extension Elements as per BPMN format. */
    private ExtensionElement addStringExtensionElement(String name, String value) {
        ExtensionElement fieldElement = new ExtensionElement();
        fieldElement.setName("activiti:field");
        fieldElement.setNamespacePrefix("activiti");
        ExtensionAttribute attribute = new ExtensionAttribute();
        attribute.setValue(name);
        attribute.setName(EXTENSION_ELEMENT_NAME);
        fieldElement.addAttribute(attribute);

        ExtensionElement stringElement = new ExtensionElement();
        stringElement.setName("activiti:string");
        stringElement.setNamespacePrefix("activiti");
        stringElement.setElementText(value);

        fieldElement.addChildElement(stringElement);
        return fieldElement;
    }

    //Whenever new Node comes, add into the last handler to include that New Node in the chain of execution
    //Chain of Responsibility
    @Override
    public NodeHandler createNodeHandlerChain() {
        NodeHandler startEventNodeHandler = new StartNodeHandler();
        NodeHandler endEventNodeHandler = new EndNodeHandler();
        NodeHandler formNodeHandler = new FormNodeHandler();
        NodeHandler apiNodeHandler = new ApiNodeHandler();
        NodeHandler xsltNodeHandler = new XsltNodeHandler();
        NodeHandler gatewayHandler = new GatewayNodeHandler();
        NodeHandler subProcessHandler = new SubProcessHandler();
        NodeHandler callActivity = new CallActivityNodeHandler();

        startEventNodeHandler.setNextHandler(endEventNodeHandler);
        endEventNodeHandler.setNextHandler(formNodeHandler);
        formNodeHandler.setNextHandler(apiNodeHandler);
        apiNodeHandler.setNextHandler(xsltNodeHandler);
        xsltNodeHandler.setNextHandler(gatewayHandler);
        gatewayHandler.setNextHandler(subProcessHandler);
        subProcessHandler.setNextHandler(callActivity);
        return startEventNodeHandler;
    }

    private void setPropertiesForCanvas(ObjectNode outputJson,PemBpmnModel pemBpmnModel,BpmnConverterRequest request) {
        ObjectNode propertiesNode = outputJson.putObject("properties");
        propertiesNode.put("author", "");
        propertiesNode.put("creationdate", "");
        propertiesNode.put("documentation", pemBpmnModel.getDescription());
        propertiesNode.put("executionlisteners", "");
        propertiesNode.put("expressionlanguage", "http://www.w3.org/1999/XPath");
        propertiesNode.put("modificationdate", "");
        propertiesNode.put("name", pemBpmnModel.getName());
        propertiesNode.put("orientation", "horizontal");
        propertiesNode.put("process_author", "");
        propertiesNode.put("process_id", request.getProcessId());
        propertiesNode.put("process_namespace", "http://www.activiti.org/processdef");
        propertiesNode.put("process_version", "");
        propertiesNode.put("targetnamespace", "http://www.activiti.org/processdef");
        propertiesNode.put("typelanguage", "http://www.w3.org/2001/XMLSchema");
        propertiesNode.put("version", pemBpmnModel.getSchemaVersion());

        outputJson.put("resourceId", "canvas");
        outputJson.putArray("ssextensions");
        outputJson.putObject("stencil").put("id", "BPMNDiagram");
        ObjectNode stencilset = outputJson.putObject("stencilset");
        stencilset.put("namespace", "http://b3mn.org/stencilset/bpmn2.0#");
        stencilset.put("url", "../stencilsets/bpmn2.0/bpmn2.0.json");
    }

    public PemBpmnModel convertToPemProcess(BpmnModel bpmnModel, BpmnConverterRequest request) {
        PemBpmnModel response = PemBpmnModel.builder()
                .schemaVersion(5)
                .build();

        request.setBpmnModel(bpmnModel);

        List<Process> processes = bpmnModel.getProcesses();
        for (Process process : processes) {
            response.setName(process.getName());
            response.setDescription(process.getDocumentation());

            PemProcess pemProcess = PemProcess.builder().build();
            List<Node> nodes = new ArrayList<>();
            List<Connector> connectors = new ArrayList<>();

            //Fetch all sequence flow and append in sequenceFlowElements List for all layers of subProcesses using recursive method appendSubProcessesSequenceFlow
            //Recursive Call
            process.getFlowElements().stream()
                    .filter(flowElement -> flowElement instanceof SubProcess)
                    .forEach(subprocess -> appendSubProcessesSequenceFlow((SubProcess) subprocess));
            log.debug("======= Generated list of all SubProcessesSequenceFlows and First layer of Sequence Flows successfully.");

            /*reverse conversion started for Nodes*/
            for (FlowElement flowElement : process.getFlowElements()) {
                if(!(flowElement instanceof SequenceFlow)){
                    Node node = PemNodeFactory.createNode(flowElement,request);
                    log.debug("======= Pem Bpmn Node creation completed for {}",flowElement.getClass());
                    if (node != null) {
                        GraphicInfo location = bpmnModel.getLocationMap().get(flowElement.getId());
                        if (location != null) {
                            node.setDiagram(Diagram.builder().x(location.getX()).y(location.getY()).build());
                        }
                        nodes.add(node);
                    }
                }
            }
            log.debug("======= Pem Bpmn Nodes created from Bpmn Model successfully.");

            /*reverse conversion started for Connectors*/
            //Fetch all sequence flow from first layer of Nodes.
            List<FlowElement> sequenceFlowElements = new ArrayList<>(process.getFlowElements().stream().filter(flowElement -> flowElement instanceof SequenceFlow).toList());

            /*reverse conversion ended for Connectors*/
            for (FlowElement sequeunceFlowElement : sequenceFlowElements){
                connectors.add(createConnector((SequenceFlow) sequeunceFlowElement, bpmnModel));
            }
            log.debug("======= Generated Pem Bpmn Model Connectors successfully.");
            pemProcess.setContextData(getContextDataFromProcess(process));
            log.debug("======= Add ContextData successfully.");
            pemProcess.setNodes(nodes);
            pemProcess.setConnectors(connectors);
            response.setProcess(pemProcess);
        }
        return response;
    }

    @Override
    public String getContextDataFromProcess(Process process) {
        String prefix = "";
        if (Objects.isNull(process.getExtensionElements()) || process.getExtensionElements().isEmpty()){
            return null;
        }
        if(Objects.nonNull(process.getExtensionElements().get("activiti:field")) && !process.getExtensionElements().get("activiti:field").isEmpty()){
            prefix = "activiti:";
        }

        for (ExtensionElement element : process.getExtensionElements().get(prefix+"field")) {
            String name = element.getAttributes().get("name").get(0).getValue();
            if(PROCESS_FIELD_CONTEXT_DATA.equalsIgnoreCase(name)){
                return element.getChildElements().get(prefix+"string").get(0).getElementText();
            }
        }
        return null;
    }

    private static void appendSubProcessesSequenceFlow(SubProcess subprocess) {

        /* System Connectors Change
         * Fetching System Connectors and Update existing Connectors Target.*/
        AtomicReference<FlowElement> connector = new AtomicReference<>();
        AtomicReference<FlowElement> systemConnector = new AtomicReference<>();
        subprocess.getFlowElements().stream().filter(flowElement -> flowElement instanceof SequenceFlow).forEach(flowElement -> {
            if(flowElement.getId().contains(SYSTEM_CONNECTOR)){
                String targetRef = ((SequenceFlow) flowElement).getTargetRef();
                ((SequenceFlow)connector.get()).setTargetRef(targetRef);
                systemConnector.set(flowElement);
            }else if (((SequenceFlow) flowElement).getTargetRef().contains(SYSTEM_USER_TASK)){
                connector.set(flowElement);
            }
        });

        /*Removing System Connector from subProcess's FlowElements*/
        subprocess.getFlowElements().remove(systemConnector.get());

        /*Add all SequenceFlow present in SubProcesses into Main sequenceFlowElements List.*/
        for (FlowElement flowElement : subprocess.getFlowElements()){
            if(flowElement instanceof SequenceFlow){

            }else if ( flowElement instanceof SubProcess ){
                appendSubProcessesSequenceFlow((SubProcess) flowElement);
            }
        }
    }

    private List<ValidationError> validateBpmnModel(BpmnModel bpmnModel){
        // Get ProcessValidator instance
        ProcessValidatorFactory processValidatorFactory = new ProcessValidatorFactory();
        ProcessValidator processValidator = processValidatorFactory.createDefaultProcessValidator();

        // Validate BPMN model
        return processValidator.validate(bpmnModel);
    }
}
