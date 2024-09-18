import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.precisely.pem.converter.ConditionHandler;
import com.precisely.pem.dtos.*;
import com.precisely.pem.exceptionhandler.BpmnConverterException;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import com.precisely.pem.service.BpmnConvertServiceImpl;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.Process;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static com.precisely.pem.dtos.Constants.PEM_PROCESS_ID;
import static org.junit.jupiter.api.Assertions.*;

public class BpmnConvertServiceTest {

    public static final String PEM_DEFINITIONS_EXAMPLE = "Pem Definitions 1";
    public static final String PEM_TEST_PROCESS = "PEM_TEST_PROCESS";
    BpmnConvertServiceImpl bpmnConvertService = new BpmnConvertServiceImpl();
    ConditionHandler conditionHandler = new ConditionHandler();

    public static String INPUT_FILE_NAME = "user_input_sample.json";
    ObjectMapper objectMapper = new ObjectMapper();

    public String inputJson = null;

    @BeforeEach
    void setUp() {
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        inputJson = readAndGetInputFile();
    }

    @Test
    public void testReadSampleUiJsonRequest(){
        assertNotNull(inputJson);
    }

    @Test
    public void testConvertUiJsonIntoBpmnDefinition() throws JsonProcessingException, BpmnConverterException {
        PemBpmnModel pemBpmnModel = objectMapper.readValue(inputJson,PemBpmnModel.class);

        BpmnModel bpmnModel = bpmnConvertService.convertIntoBpmnDefinition(pemBpmnModel, BpmnConverterRequest.builder().processId(PEM_TEST_PROCESS).build() );

        assertNotNull(bpmnModel);
        assertEquals(1,bpmnModel.getProcesses().size());

        Process process = bpmnModel.getProcesses().get(0);
        assertEquals(PEM_DEFINITIONS_EXAMPLE,process.getName());
        assertEquals(PEM_PROCESS_ID,process.getId());

        Assertions.assertNotEquals(0,process.getFlowElements().size());
    }

    @Test
    public void testConvertBpmnDefinitionIntoUiJson() throws JsonProcessingException, BpmnConverterException {

        BpmnModel bpmnModel = bpmnConvertService
                .convertIntoBpmnDefinition(objectMapper.readValue(inputJson,PemBpmnModel.class),BpmnConverterRequest.builder().processId(PEM_TEST_PROCESS).build() );
        PemBpmnModel pemBpmnModelOutput = bpmnConvertService.convertToPemProcess(bpmnModel, BpmnConverterRequest.builder().build());

        assertNotNull(pemBpmnModelOutput);
        assertEquals(PEM_DEFINITIONS_EXAMPLE,pemBpmnModelOutput.getName());
        assertNotNull(pemBpmnModelOutput.getProcess());
        Assertions.assertNotEquals(0,pemBpmnModelOutput.getProcess().getNodes().size());
        Assertions.assertNotEquals(0,pemBpmnModelOutput.getProcess().getConnectors().size());
    }

    private static String readAndGetInputFile() {
        try {
            ClassPathResource classPathResource = new ClassPathResource(INPUT_FILE_NAME);
            Path filePath = Paths.get(classPathResource.getURI());
            return  new String(Files.readAllBytes(filePath));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testRefactorConnectorConditions_ConditionIsNull() {
        List<Connector> connectors = new ArrayList<>();
        Connector connector = new Connector();
        connector.setCondition(null);
        connectors.add(connector);
        PemBpmnModel model = PemBpmnModel.builder().process(PemProcess.builder().connectors(connectors).build()).build();
        conditionHandler.refactorConnectorConditions(model);
        assertNull(connector.getCondition());
    }
    @Test
    void testRefactorConnectorConditions_ConditionIsEmpty() {
        PemBpmnModel pemBpmnModel = new PemBpmnModel();
        List<Connector> connectors = new ArrayList<>();
        Connector connector = new Connector();
        connector.setCondition("");
        connectors.add(connector);
        PemBpmnModel model = PemBpmnModel.builder().process(PemProcess.builder().connectors(connectors).build()).build();
        conditionHandler.refactorConnectorConditions(pemBpmnModel);
        assertTrue(connector.getCondition().isEmpty());
    }
    @Test
    void testRefactorConnectorConditions_ValidCondition() {
        Connector connector = Connector.builder().condition("{\"group\":{\"combinator\":\"AND\",\"not\":false,\"rules\":[{\"rule\":{\"lhs\":\"age\",\"rhs\":\"30\",\"operator\":\"equals\",\"dataType\":\"number\"}}]}}").build();
        List<Connector> connectors = new ArrayList<>();
        connectors.add(connector);
        PemBpmnModel model = PemBpmnModel.builder().process(PemProcess.builder().connectors(connectors).build()).build();
        GroupContainer groupContainer = new GroupContainer(new Group("AND", false, Collections.singletonList(new RuleContainer(new Rule("number", "age", "30", "equals"), null))));
        conditionHandler.refactorConnectorConditions(model);
        assertNotNull(connector.getCondition());
    }
    @Test
    void testConvertGroupToUel_SimpleGroup() throws ResourceNotFoundException {
        Group group = new Group("AND", false, Collections.singletonList(new RuleContainer(new Rule("number", "age", "30", "equals"), null)));
        String result = conditionHandler.convertGroupToUel(group);
        assertEquals("age == 30", result);
    }
    @Test
    void testConvertGroupToUel_NestedGroup() throws ResourceNotFoundException {
        Group nestedGroup = new Group("OR", false, Collections.singletonList(new RuleContainer(new Rule("number", "salary", "5000", "greaterThan"), null)));
        Group group = new Group("AND", false, Collections.singletonList(new RuleContainer(null, nestedGroup)));
        String result = conditionHandler.convertGroupToUel(group);
        assertEquals("(salary > 5000)", result);
    }

    @Test
    void testConvertGroupToUel_NestedGroupGt() throws ResourceNotFoundException {
        Group nestedGroup = new Group("OR", false, Collections.singletonList(new RuleContainer(new Rule("number", "salary", "5000", "lessThan"), null)));
        Group group = new Group("AND", false, Collections.singletonList(new RuleContainer(null, nestedGroup)));
        String result = conditionHandler.convertGroupToUel(group);
        assertEquals("(salary < 5000)", result);
    }

    @Test
    void testConvertGroupToUel_NestedGroupLtEq() throws ResourceNotFoundException {
        Group nestedGroup = new Group("OR", false, Collections.singletonList(new RuleContainer(new Rule("number", "salary", "5000", "greaterThanEquals"), null)));
        Group group = new Group("AND", false, Collections.singletonList(new RuleContainer(null, nestedGroup)));
        String result = conditionHandler.convertGroupToUel(group);
        assertEquals("(salary >= 5000)", result);
    }

    @Test
    void testConvertGroupToUel_NestedGroupGtEq() throws ResourceNotFoundException {
        Group nestedGroup = new Group("OR", false, Collections.singletonList(new RuleContainer(new Rule("number", "salary", "5000", "lessThanEquals"), null)));
        Group group = new Group("AND", false, Collections.singletonList(new RuleContainer(null, nestedGroup)));
        String result = conditionHandler.convertGroupToUel(group);
        assertEquals("(salary <= 5000)", result);
    }
    @Test
    void testConvertGroupToUel_NestedGroupNtEq() throws ResourceNotFoundException {
        Group nestedGroup = new Group("OR", false, Collections.singletonList(new RuleContainer(new Rule("number", "salary", "5000", "isNotNull"), null)));
        Group group = new Group("AND", false, Collections.singletonList(new RuleContainer(null, nestedGroup)));
        String result = conditionHandler.convertGroupToUel(group);
        assertEquals("(salary != null)", result);
    }
    @Test
    void testConvertGroupToUel_NotGroup() throws ResourceNotFoundException {
        Group group = new Group("AND", true, Collections.singletonList(new RuleContainer(new Rule("number", "age", "30", "equals"), null)));
        String result = conditionHandler.convertGroupToUel(group);
        assertEquals("not (age == 30)", result);
    }
    @Test
    void testConvertRuleToUel_SimpleRule() throws ResourceNotFoundException {
        Rule rule = new Rule("number", "age", "30", "equals");
        String result = conditionHandler.convertRuleToUel(rule);
        assertEquals("age == 30", result);
    }
    @Test
    void testConvertRuleToUel_StringContainsRule() throws ResourceNotFoundException {
        Rule rule = new Rule("string", "name", "John", "contains");
        String result = conditionHandler.convertRuleToUel(rule);
        assertEquals("\"name\".contains(\"John\")", result);
    }

    @Test
    void testConvertRuleToUel_StringNotContainsRule() throws ResourceNotFoundException {
        Rule rule = new Rule("string", "name", "John", "notContains");
        String result = conditionHandler.convertRuleToUel(rule);
        assertEquals("!\"name\".contains(\"John\")", result);
    }

    @Test
    void testConvertRuleToUel_StringStartsWithRule() throws ResourceNotFoundException {
        Rule rule = new Rule("string", "name", "John", "startsWith");
        String result = conditionHandler.convertRuleToUel(rule);
        assertEquals("\"name\".startsWith(\"John\")", result);
    }

    @Test
    void testConvertRuleToUel_StringNotStartsWithRule() throws ResourceNotFoundException {
        Rule rule = new Rule("string", "name", "John", "notStartsWith");
        String result = conditionHandler.convertRuleToUel(rule);
        assertEquals("!\"name\".startsWith(\"John\")", result);
    }

    @Test
    void testConvertRuleToUel_StringEndsWithRule() throws ResourceNotFoundException {
        Rule rule = new Rule("string", "name", "John", "endsWith");
        String result = conditionHandler.convertRuleToUel(rule);
        assertEquals("\"name\".endsWith(\"John\")", result);
    }

    @Test
    void testConvertRuleToUel_StringNotEndsWithRule() throws ResourceNotFoundException {
        Rule rule = new Rule("string", "name", "John", "notEndsWith");
        String result = conditionHandler.convertRuleToUel(rule);
        assertEquals("!\"name\".endsWith(\"John\")", result);
    }

//    @Test
//    void testConvertRuleToUel_StringInRule() throws ResourceNotFoundException {
//        Rule rule = new Rule("string", "name", "John, Shawn, Michael", "in");
//        String result = conditionHandler.convertRuleToUel(rule);
//        assertEquals("name in (\"John\", \"Shawn\", \"Michael\")", result);
//    }
    @Test
    void testConvertRuleToUel_DateRule() throws ResourceNotFoundException {
        Rule rule = new Rule("date", "dateOfBirth", "01/01/2000", "after");
        String result = conditionHandler.convertRuleToUel(rule);
        assertEquals("\"dateOfBirth\".after(\"01/01/2000\")", result);
    }

    @Test
    void testConvertRuleToUel_DateRule1() throws ResourceNotFoundException {
        Rule rule = new Rule("date", "dateOfBirth", "01/01/2000", "before");
        String result = conditionHandler.convertRuleToUel(rule);
        assertEquals("\"dateOfBirth\".before(\"01/01/2000\")", result);
    }

//    @Test
//    void testConvertRuleToUel_DateRuleBetween() throws ResourceNotFoundException {
//        Rule rule = new Rule("date", "dateOfBirth", "01/01/2000,01/01/2010", "between");
//        String result = conditionHandler.convertRuleToUel(rule);
//        assertEquals("dateOfBirth between (new java.text.SimpleDateFormat(\"MM/DD/YYYY\").parse(\"01/01/2000\") and new java.text.SimpleDateFormat(\"MM/dd/yyyy\").parse(\"01/01/2010\"))", result);
//    }

    @Test
    void testConvertRuleToUel_StringEq() throws ResourceNotFoundException {
        Rule rule = new Rule("string", "name", "John", "equals");
        String result = conditionHandler.convertRuleToUel(rule);
        assertEquals("\"name\".equals(\"John\")", result);
    }

    @Test
    void testConvertRuleToUel_Bool() throws ResourceNotFoundException {
        Rule rule = new Rule("boolean", "isMusician", "true", "equals");
        String result = conditionHandler.convertRuleToUel(rule);
        assertEquals("isMusician == true", result);
    }

    @Test
    void testConvertRuleToUel_BoolEq() throws ResourceNotFoundException {
        Rule rule = new Rule("boolean", "isMusician", "true", "equals");
        String result = conditionHandler.convertRuleToUel(rule);
        assertEquals("isMusician == true", result);
    }

    @Test
    void testConvertRuleToUel_BoolFalseEq() throws ResourceNotFoundException {
        Rule rule = new Rule("boolean", "isMusician", "false", "equals");
        String result = conditionHandler.convertRuleToUel(rule);
        assertEquals("isMusician == false", result);
    }

    @Test
    void testConvertRuleToUel_BoolNEq() throws ResourceNotFoundException {
        Rule rule = new Rule("boolean", "isMusician", "true", "notEquals");
        String result = conditionHandler.convertRuleToUel(rule);
        assertEquals("isMusician != true", result);
    }

    @Test
    void testConvertRuleToUel_BoolNEqFalse() throws ResourceNotFoundException {
        Rule rule = new Rule("boolean", "isMusician", "false", "notEquals");
        String result = conditionHandler.convertRuleToUel(rule);
        assertEquals("isMusician != false", result);
    }

    @Test
    void testConvertRuleToUel_BoolNEqFalseInvalid() throws ResourceNotFoundException {
        Rule rule = new Rule("boolean", "isMusician", "false", "++");
        Exception exception = assertThrows(ResourceNotFoundException.class, () -> conditionHandler.convertRuleToUel(rule));
        assertEquals(exception.getMessage(), "++ operator not found for boolean. Kindly check the data.");
    }

    @Test
    void testConvertRuleToUel_NumberNInvalid() throws ResourceNotFoundException {
        Rule rule = new Rule("number", "salary", "6000", "++");
        Exception exception = assertThrows(ResourceNotFoundException.class, () -> conditionHandler.convertRuleToUel(rule));
        assertEquals(exception.getMessage(), "++ operator not found for number. Kindly check the data.");
    }

    @Test
    void testConvertRuleToUel_StringInvalid() throws ResourceNotFoundException {
        Rule rule = new Rule("string", "name", "PEM", "++");
        Exception exception = assertThrows(ResourceNotFoundException.class, () -> conditionHandler.convertRuleToUel(rule));
        assertEquals(exception.getMessage(), "++ operator not found for string. Kindly check the data.");
    }

    @Test
    void testConvertRuleToUel_DateInvalid() throws ResourceNotFoundException {
        Rule rule = new Rule("date", "dateOfBirth", "01/01/2000", "++");
        Exception exception = assertThrows(ResourceNotFoundException.class, () -> conditionHandler.convertRuleToUel(rule));
        assertEquals(exception.getMessage(), "++ operator not found for date. Kindly check the data.");
    }
}
