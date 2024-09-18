package com.precisely.pem.config;

import org.activiti.engine.ActivitiIllegalArgumentException;
import org.activiti.engine.ActivitiObjectNotFoundException;
import org.activiti.engine.impl.persistence.deploy.DeploymentManager;
import org.activiti.engine.impl.persistence.deploy.ProcessDefinitionCacheEntry;
import org.activiti.engine.repository.ProcessDefinition;

public class CustomDeploymentManager extends DeploymentManager {

	@Override
	public ProcessDefinition findDeployedProcessDefinitionById(String processDefinitionId) {
		if (processDefinitionId == null) {
			throw new ActivitiIllegalArgumentException("Invalid process definition id : null");
		}

		// first try the cache
		ProcessDefinitionCacheEntry cacheEntry = processDefinitionCache.get(processDefinitionId);
		// ProcessDefinitionCacheEntry cacheEntry = null;
		ProcessDefinition processDefinition = cacheEntry != null ? cacheEntry.getProcessDefinition() : null;

		if (processDefinition == null) {
			processDefinition = processDefinitionEntityManager.findById(processDefinitionId);
			if (processDefinition == null) {
				throw new ActivitiObjectNotFoundException(
						"no deployed process definition found with id '" + processDefinitionId + "'",
						ProcessDefinition.class);
			}
			processDefinition = resolveProcessDefinition(processDefinition).getProcessDefinition();
		}
		return processDefinition;
	}

}
