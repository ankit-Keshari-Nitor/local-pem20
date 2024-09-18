package com.precisely.pem.service;

import lombok.extern.log4j.Log4j2;
import org.activiti.engine.delegate.BpmnError;
import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.Expression;
import org.activiti.engine.delegate.JavaDelegate;
import org.apache.commons.text.StringEscapeUtils;
import org.springframework.stereotype.Service;

import javax.xml.transform.*;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

@Service("XsltTransformationDelegate")
@Log4j2
public class XsltTransformationDelegate implements JavaDelegate {

    private Expression input;
    private Expression xslt;
    private Expression output;
    private Expression sampleOutput;
    private Expression type;
    private Expression escapeInput;

    @Override
    public void execute(DelegateExecution execution) throws Error {
        String serviceTaskId = (String) execution.getCurrentActivityId();

        String inputXml = (String) input.getValue(execution);
        String xsltTemplate = (String) xslt.getValue(execution);
        String xsltSampleOutput = (String) sampleOutput.getValue(execution);
        String escapeInputValue = (String) escapeInput.getValue(execution);

        inputXml = inputXml.trim();

        try {
            String transformedOutput = transformXmlWithXslt(inputXml, xsltTemplate,escapeInputValue);
            String cleanedResponse = transformedOutput
                    .replaceAll(">\\s+<", "><")  // Remove whitespace between XML tags
                    .replaceAll(">\\s+<", "><")  // Repeat to ensure removal of multiple whitespaces
                    .trim();
            Map<String, Object> processVariables = execution.getVariables();
            if (processVariables.isEmpty()) {
                processVariables = new HashMap<>();
            }

            Map<String, Object> nodeResultsMap = new HashMap<>();
            nodeResultsMap.put("output",cleanedResponse);

            processVariables.put(serviceTaskId, nodeResultsMap);
            execution.setVariables(processVariables);
            log.info(processVariables);
        } catch (TransformerException e) {
            handleException("Error during XSLT transformation", e);
        } catch (Exception e) {
            handleException("Unexpected error during XSLT transformation", e);
        }
    }

    private String transformXmlWithXslt(String inputXml, String xsltTemplate, String escapeInput) throws TransformerException {
        Source xmlSource = new StreamSource(new StringReader(inputXml));
        Source xsltSource = new StreamSource(new StringReader(xsltTemplate));

        StringWriter writer = new StringWriter();
        Result result = new StreamResult(writer);

        TransformerFactory factory = TransformerFactory.newInstance();
        Transformer transformer = factory.newTransformer(xsltSource);
        transformer.transform(xmlSource, result);

        return writer.toString();
    }

    private void handleException(String errorMessage, Exception e) throws Error {
        log.info("TRANSFORMATION_ERROR: " + errorMessage + e.getMessage());
        throw new BpmnError("TRANSFORMATION_ERROR", errorMessage);
    }

}
