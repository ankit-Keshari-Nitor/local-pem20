package com.precisely.pem.config;

import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.impl.bpmn.deployer.ParsedDeployment;
import org.activiti.engine.impl.bpmn.deployer.ParsedDeploymentBuilder;
import org.activiti.engine.impl.bpmn.parser.BpmnParse;
import org.activiti.engine.impl.bpmn.parser.BpmnParser;
import org.activiti.engine.impl.cmd.DeploymentSettings;
import org.activiti.engine.impl.persistence.entity.DeploymentEntity;
import org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.activiti.engine.impl.persistence.entity.ResourceEntity;

public class CustomParsedDeploymentBuilder extends ParsedDeploymentBuilder {

    public CustomParsedDeploymentBuilder(DeploymentEntity deployment, BpmnParser bpmnParser,
                                         Map<String, Object> deploymentSettings) {
        super(deployment, bpmnParser, deploymentSettings);
    }

    public ParsedDeployment build() {
        List<ProcessDefinitionEntity> processDefinitions = new ArrayList<ProcessDefinitionEntity>();
        Map<ProcessDefinitionEntity, BpmnParse> processDefinitionsToBpmnParseMap
                = new LinkedHashMap<ProcessDefinitionEntity, BpmnParse>();
        Map<ProcessDefinitionEntity, ResourceEntity> processDefinitionsToResourceMap
                = new LinkedHashMap<ProcessDefinitionEntity, ResourceEntity>();

        for (ResourceEntity resource : deployment.getResources().values()) {

			// TODO : Need to add decryption logic here once we implemented end to end flow.
            // We have used 64 encode/decode for now to implement this functionality,
            // We will replace this with vault concept later

            String diagram = new String(resource.getBytes());
            System.out.println("=========DB Read : Encoded BPMN Schema=========");
            System.out.println(diagram);

            // decode a String
            byte[] decode = Base64.getDecoder().decode(diagram);

            String decode_diagram = new String(decode);
            System.out.println("=========Decoded BPMN Schema=========");
            System.out.println(decode_diagram);

            if (isBpmnResource(resource.getName())) {

                BpmnParse parse = createBpmnParseFromResource(resource.getName(), decode);
                for (ProcessDefinitionEntity processDefinition : parse.getProcessDefinitions()) {
                    processDefinitions.add(processDefinition);
                    processDefinitionsToBpmnParseMap.put(processDefinition, parse);
                    processDefinitionsToResourceMap.put(processDefinition, resource);
                }
            }
        }

        return new ParsedDeployment(deployment, processDefinitions,
                processDefinitionsToBpmnParseMap, processDefinitionsToResourceMap);
    }

    protected BpmnParse createBpmnParseFromResource(String resourceName, byte[] def) {
        ByteArrayInputStream inputStream = new ByteArrayInputStream(def);

        BpmnParse bpmnParse = bpmnParser.createParse()
                .sourceInputStream(inputStream)
                .setSourceSystemId(resourceName)
                .deployment(deployment)
                .name(resourceName);

        if (deploymentSettings != null) {

            // Schema validation if needed
            if (deploymentSettings.containsKey(DeploymentSettings.IS_BPMN20_XSD_VALIDATION_ENABLED)) {
                bpmnParse.setValidateSchema((Boolean) deploymentSettings.get(DeploymentSettings.IS_BPMN20_XSD_VALIDATION_ENABLED));
            }

            // Process validation if needed
            if (deploymentSettings.containsKey(DeploymentSettings.IS_PROCESS_VALIDATION_ENABLED)) {
                bpmnParse.setValidateProcess((Boolean) deploymentSettings.get(DeploymentSettings.IS_PROCESS_VALIDATION_ENABLED));
            }

        } else {
            // On redeploy, we assume it is validated at the first deploy
            bpmnParse.setValidateSchema(false);
            bpmnParse.setValidateProcess(false);
        }

        bpmnParse.execute();
        return bpmnParse;
    }

}
