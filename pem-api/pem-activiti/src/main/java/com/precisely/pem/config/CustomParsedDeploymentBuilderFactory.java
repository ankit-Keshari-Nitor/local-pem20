package com.precisely.pem.config;

import org.activiti.engine.impl.bpmn.deployer.ParsedDeploymentBuilder;
import org.activiti.engine.impl.bpmn.deployer.ParsedDeploymentBuilderFactory;
import org.activiti.engine.impl.persistence.entity.DeploymentEntity;

import java.util.Map;

public class CustomParsedDeploymentBuilderFactory extends ParsedDeploymentBuilderFactory {

    public ParsedDeploymentBuilder getBuilderForDeploymentAndSettings(DeploymentEntity deployment,
                                                                      Map<String, Object> deploymentSettings) {
        return new CustomParsedDeploymentBuilder(deployment, bpmnParser, deploymentSettings);
    }

}
