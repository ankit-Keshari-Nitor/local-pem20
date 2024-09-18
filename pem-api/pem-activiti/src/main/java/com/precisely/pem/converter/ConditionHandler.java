package com.precisely.pem.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.precisely.pem.dtos.*;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import lombok.extern.log4j.Log4j2;
import org.activiti.engine.impl.util.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Log4j2
public class ConditionHandler {

    ObjectMapper objectMapper = new ObjectMapper();

    public void refactorConnectorConditions(PemBpmnModel pemBpmnModel) {
        List<Connector> connectors = getConnectors(pemBpmnModel);
        log.info("Connectors available for condition conversion : {}", connectors.size());
        connectors.forEach(p -> {
            if (!Objects.isNull(p.getCondition()) && !p.getCondition().isEmpty()) {
                JSONObject connectorData = new JSONObject(p.getCondition());
                try {
                    StringBuilder uelExpression = new StringBuilder();
                    GroupContainer groupContainer = objectMapper.readValue(connectorData.toString(), GroupContainer.class);
                    uelExpression.append(convertGroupToUel(groupContainer.getGroup()));
                    //save condition and save data to database
                    uelExpression.insert(0,"${");
                    uelExpression.append("}");
                    p.setCondition(uelExpression.toString());
                    log.info("Condition for node : {}", uelExpression.toString());
                } catch (JsonProcessingException | ResourceNotFoundException e) {
                    throw new RuntimeException(e);
                }
            }
        });
    }

    public static List<Connector> getConnectors(PemBpmnModel model) {
        List<Connector> connectors = new ArrayList<>();
        if (model != null && model.getProcess() != null) {
            PemProcess process = model.getProcess();
            if (process.getConnectors() != null) {
                connectors.addAll(process.getConnectors());
            }
            if (process.getNodes() != null) {
                for (Node node : process.getNodes()) {
                    extractConnectorsFromNode(node, connectors);
                }
            }
        }
        return connectors;
    }

    public boolean isValidFormat(String format, String value) {
        Date date = null;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat(format);
            date = sdf.parse(value);
            if (!value.equals(sdf.format(date))) {
                date = null;
            }
        } catch (ParseException ex) {
            log.error(ex.getMessage());
        }
        return date != null;
    }

    private static void extractConnectorsFromNode(Node node, List<Connector> connectors) {
        if (node.getConnectors() != null) {
            connectors.addAll(node.getConnectors());
        }
        if (node.getNodes() != null) {
            for (Node childNode : node.getNodes()) {
                extractConnectorsFromNode(childNode, connectors);
            }
        }
    }

    public String convertGroupToUel(Group group) throws ResourceNotFoundException {
        if(group.getCombinator() != null && !group.getCombinator().isEmpty() &&
                !(group.getCombinator().equalsIgnoreCase("AND") ||
                        group.getCombinator().equalsIgnoreCase("and") ||
                        group.getCombinator().equalsIgnoreCase("OR") ||
                        group.getCombinator().equalsIgnoreCase("or")))
            throw new ResourceNotFoundException("groupCombinatorData", "NoDataFound","group condition not found. Kindly check the data.");

        StringJoiner joiner = new StringJoiner(" " + group.getCombinator() + " ");
        for (RuleContainer ruleContainer : group.getRules()) {
            if (ruleContainer.getRule() != null) {
                joiner.add(convertRuleToUel(ruleContainer.getRule()));
            } else if (ruleContainer.getGroup() != null) {
                joiner.add("(" + convertGroupToUel(ruleContainer.getGroup()) + ")");
            }
        }
        String expression = joiner.toString();
        if (group.isNot()) {
            expression = "not (" + expression + ")";
        }
        return expression;
    }

    public String convertRuleToUel(Rule rule) throws ResourceNotFoundException {
        if(rule.getDataType() != null && !rule.getDataType().isEmpty() &&
                rule.getOperator() != null && !rule.getOperator().isEmpty() &&
                rule.getLhs() != null && !rule.getLhs().isEmpty() &&
                rule.getRhs() != null && !rule.getRhs().isEmpty()) {
            String operator = null;
            String rhs = rule.getRhs();
            String dataType = rule.getDataType().toLowerCase();
            switch (dataType) {
                case "boolean":
                    operator = booleanMap.get(rule.getOperator());
                    if (operator == null)
                        throw new ResourceNotFoundException("operatorData", "NoDataFound", rule.getOperator() + " operator not found for " + dataType + ". Kindly check the data.");
                    rhs = rhs.toLowerCase();
                    if (operator.equalsIgnoreCase("== null") ||
                            operator.equalsIgnoreCase("!= null")) {
                        return rule.getLhs() + " " + operator;
                    }
                    return rule.getLhs() + " " + operator + " " + rhs;
                case "number":
                    operator = numberMap.get(rule.getOperator());
                    if (operator == null)
                        throw new ResourceNotFoundException("operatorData", "NoDataFound", rule.getOperator() + " operator not found for " + dataType + ". Kindly check the data.");
                    if (operator.equals("in") || operator.equals("not in")) {
                        return rule.getLhs() + " " + operator + " (" + formatInNotInValues(rhs) + ")";
                    } else if (operator.equals("between") || operator.equals("not between")) {
                        String[] range = rhs.split(",");
                        rhs = range[0].trim() + " and " + range[1].trim();
                        return rule.getLhs() + " " + operator + " " + rhs;
                    } else if((operator.equalsIgnoreCase("== null") ||
                            operator.equalsIgnoreCase("!= null"))) {
                        return rule.getLhs() + " " + operator;
                    } else {
                        return rule.getLhs() + " " + operator + " " + rhs;
                    }
                case "date":
                    operator = dateMap.get(rule.getOperator());
                    if(operator == null)
                        throw new ResourceNotFoundException("operatorData", "NoDataFound",rule.getOperator()+" operator not found for "+dataType+". Kindly check the data.");
                    String lhs = null;
                    rhs = null;
                    if(isValidFormat("MM/dd/yyyy", rule.getLhs()) ||
                            isValidFormat("MM/dd/yyyy", rule.getRhs())){
                        lhs = rule.getLhs();
                        rhs = rule.getRhs();
                    }
                    if(lhs == null || rhs == null)
                        throw new ResourceNotFoundException("OperandData", "NoDataFound"," LHS/RHS date format is not valid. Kindly check the data.");

                    if (operator.equals(".after") || operator.equals(".before") ||
//                            operator.equals("==") || operator.equals("!=") ||
                            operator.equals(".equals")) {
//                        rhs = "new java.text.SimpleDateFormat(\"MM/DD/YYYY\").parse(\"" + rhs + "\")";
//                        return rule.getLhs() + operator + "(" + rhs + ")";
                        return "\"" + rule.getLhs() + "\""+ operator +"(\""+rule.getRhs()+"\")";
                    }
                    if (operator.equals("between") || operator.equals("not between")) {
                        String[] dates = rhs.split(",");
                        rhs = "new java.text.SimpleDateFormat(\"MM/dd/yyyy\").parse(\"" + dates[0] + "\") and new java.text.SimpleDateFormat(\"MM/dd/yyyy\").parse(\"" + dates[1] + "\")";
                        return rule.getLhs() + " " + operator + " (" + rhs + ")";
                    }
                case "string":
                    operator = stringMap.get(rule.getOperator());
                    if(operator == null)
                        throw new ResourceNotFoundException("operatorData", "NoDataFound",rule.getOperator()+" operator not found for "+dataType+". Kindly check the data.");
                    if (rule.getOperator().equalsIgnoreCase("startsWith") ||
                            rule.getOperator().equalsIgnoreCase("endsWith") ||
                            rule.getOperator().equalsIgnoreCase("contains") ||
                            rule.getOperator().equalsIgnoreCase("equals")) {
                        return "\""+rule.getLhs()+"\"" + operator + "(\"" + rhs + "\")";
                    }
                    if (rule.getOperator().equalsIgnoreCase("notStartsWith") ||
                            rule.getOperator().equalsIgnoreCase("notEndsWith") ||
                            rule.getOperator().equalsIgnoreCase("notContains") ||
                            rule.getOperator().equalsIgnoreCase("notEquals")) {
                        return "!" + "\""+rule.getLhs()+"\"" + operator + "(\"" + rhs + "\")";
                    }
                    if (operator.equalsIgnoreCase("== null") ||
                            operator.equalsIgnoreCase("!= null")) {
                        return "\""+rule.getLhs() + "\" " + operator;
                    }
                    if (operator.equalsIgnoreCase("in") ||
                            operator.equalsIgnoreCase("not in")) {
                        return rule.getLhs() + " " + operator + " (" + formatInNotInValues(rhs) + ")";
                    }
                default:
                    rhs = "\"" + rhs + "\"";
                    break;
            }
            return rule.getLhs() + " " + operator + " " + rhs;
        }else{
            throw new ResourceNotFoundException("ruleData", "NoDataFound"," Rule data not found. Kindly check the Rule Data.");
        }
    }

    public String formatInNotInValues(String values) {
        String[] multiValues = values.split(",");
        StringBuilder formattedValues = new StringBuilder();
        for (int i = 0; i < multiValues.length; i++) {
            formattedValues.append("\"").append(multiValues[i].trim()).append("\"");
            if (i < multiValues.length - 1) {
                formattedValues.append(", ");
            }
        }
        return formattedValues.toString();
    }

    public final Map<String,String> numberMap = Map.ofEntries(
            Map.entry("lessThan", "<"),
            Map.entry("greaterThan", ">"),
            Map.entry("lessThanEquals", "<="),
            Map.entry("greaterThanEquals", ">="),
            Map.entry("notEquals", "!="),
            Map.entry("equals", "=="),
            Map.entry("isNull", "== null"),
            Map.entry("isNotNull", "!= null")
    );

    public final Map<String,String> booleanMap = Map.ofEntries(
            Map.entry("notEquals", "!="),
            Map.entry("equals", "==")
    );

    public final Map<String,String> dateMap = Map.ofEntries(
            Map.entry("equals",".equals"),
            Map.entry("notEquals",".equals"),
            Map.entry("after", ".after"),
            Map.entry("before", ".before"),
            Map.entry("isNull", "== null"),
            Map.entry("isNotNull", "!= null")
    );

    public final Map<String,String> stringMap = Map.ofEntries(
            Map.entry("equals",".equals"),
            Map.entry("notEquals",".equals"),
            Map.entry("startsWith", ".startsWith"),
            Map.entry("notStartsWith", ".startsWith"),
            Map.entry("endsWith", ".endsWith"),
            Map.entry("notEndsWith", ".endsWith"),
            Map.entry("contains", ".contains"),
            Map.entry("notContains", ".contains"),
            Map.entry("isNull", "== null"),
            Map.entry("isNotNull", "!= null")
    );
}
