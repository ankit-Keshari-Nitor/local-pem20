package com.precisely.pem.config;

import org.activiti.engine.impl.bpmn.deployer.BpmnDeployer;
import org.activiti.engine.impl.cfg.StandaloneProcessEngineConfiguration;
import org.activiti.engine.impl.persistence.deploy.Deployer;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class CustomProcessEngineConfiguration extends StandaloneProcessEngineConfiguration {
    @Override
    public void initServices() {
        super.initServices();
    }

    @Override
    public void initEntityManagers() {
        super.initEntityManagers();
        resourceEntityManager = new CustomResourceEntityManager(this, resourceDataManager);
    }


    @Override
    public void initBpmnDeployerDependencies() {
        super.initBpmnDeployerDependencies();
        parsedDeploymentBuilderFactory = new CustomParsedDeploymentBuilderFactory();

        if (parsedDeploymentBuilderFactory.getBpmnParser() == null) {
            parsedDeploymentBuilderFactory.setBpmnParser(bpmnParser);
        }

    }

    @Override
    public Collection<? extends Deployer> getDefaultDeployers() {
        List<Deployer> defaultDeployers = new ArrayList<Deployer>();

        if (bpmnDeployer == null) {
            bpmnDeployer = new BpmnDeployer();
        }

        initBpmnDeployerDependencies();

        bpmnDeployer.setIdGenerator(idGenerator);
        bpmnDeployer.setParsedDeploymentBuilderFactory(parsedDeploymentBuilderFactory);
        bpmnDeployer.setBpmnDeploymentHelper(bpmnDeploymentHelper);
        bpmnDeployer.setCachingAndArtifactsManager(cachingAndArtifactsManager);

        defaultDeployers.add(bpmnDeployer);
        return defaultDeployers;
    }


    @Override
    public void initDeployers() {
        if (this.deployers == null) {
            this.deployers = new ArrayList<Deployer>();
            if (customPreDeployers != null) {
                this.deployers.addAll(customPreDeployers);
            }
            this.deployers.addAll(getDefaultDeployers());
            if (customPostDeployers != null) {
                this.deployers.addAll(customPostDeployers);
            }
        }

        if (deploymentManager == null) {
            deploymentManager = new CustomDeploymentManager();
            deploymentManager.setDeployers(deployers);

            deploymentManager.setProcessDefinitionCache(processDefinitionCache);
            deploymentManager.setProcessDefinitionInfoCache(processDefinitionInfoCache);
            deploymentManager.setKnowledgeBaseCache(knowledgeBaseCache);
            deploymentManager.setProcessEngineConfiguration(this);
            deploymentManager.setProcessDefinitionEntityManager(processDefinitionEntityManager);
            deploymentManager.setDeploymentEntityManager(deploymentEntityManager);
        }
    }

}